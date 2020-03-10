const { connection } = require("../server/connect_db");
const utm = require("utm");


const warning = { Warning: "No data found or incorrect input." };
const exception = { Exception: "Unknown exception." };
class ConditionalSwitch {
  constructor() {
    this.lastExecuted = false;
  }

  case(condition, func) {
    if (condition) {
      func();
      this.lastExecuted = true;
    } else {
      this.lastExecuted = false;
    }
    return this;
  }

  break() {
    if (this.lastExecuted) return new Break();
    return this;
  }

  default(func) {
    if (!this.lastExecuted) func();
  }
}

class Break {
  case() {
    return this;
  }
  break() {
    return this;
  }
  default() {
    return this;
  }
}

const Cswitch = () => {
  return new ConditionalSwitch();
};

const queryCitizenExists = async (surname, forenames, res) => {
  try {
    const results = await connection.query(
      "SELECT * FROM citizen WHERE forenames LIKE '%" +
        forenames +
        "%' AND surname LIKE '%" +
        surname +
        "%'"
    );
    if (results[0].length) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch {
    res.json(exception);
  }
};

const queryCitizen = async (surname, forenames, res) => {
  try {
    const results = await connection.query(
      "SELECT * FROM citizen WHERE forenames LIKE '%" +
        forenames +
        "%' AND surname LIKE '%" +
        surname +
        "%'"
    );
    if (results[0].length) {
      res.send(results[0]);
    } else {
      res.send(results[0]);
    }
  } catch {
    res.json(exception);
  }
};

const queryCitizenById = async (citizenID, res) => {
  try {
    await connection
      .query("SELECT * FROM citizen WHERE citizenID LIKE '" + citizenID + "'")
      .then(cit => {
        connection
          .query(
            "SELECT * FROM vehicle_registrations WHERE forenames LIKE '" +
              cit[0][0].forenames +
              "'" +
              " AND surname LIKE '" +
              cit[0][0].surname +
              "'" +
              " AND dateOfBirth LIKE '" +
              cit[0][0].dateOfBirth +
              "'"
          )
          .then(veh => {
            for (let i of veh[0]) {
              i.streetName = i.streetName.substring(4);
              i.postcode = i.postcode.substring(1, i.postcode.length - 1);
              i.city = i.city.substring(1);
            }
            const toReturn = {
              citizenID: cit[0][0].citizenID,
              dateOfBirth: cit[0][0].dateOfBirth,
              streetName: cit[0][0].streetName.substring(4),
              city: cit[0][0].city.substring(1),
              postcode: cit[0][0].postcode.substring(
                1,
                cit[0][0].postcode.length - 1
              ),
              placeOfBirth: cit[0][0].placeOfBirth,
              vehicleRegistrations: veh[0]
            };
            res.json(toReturn);
          });
      });
  } catch {
    res.json({ exception: "No data found or incorrect input." });
  }
};

const queryBankCardByCitizen = async (citizenID, res) => {
  let queryString =
    "SELECT bankCardId, cardNumber, sortCode, b.bankAccountId, b.accountNumber, b.bank, c.forenames, c.surname, c.dateOfBirth FROM citizen AS c " +
    "INNER JOIN bank_account_holders AS b ON c.forenames = b.forenames and c.surname = b.surname and c.dateOfBirth = b.dateOfBirth " +
    "INNER JOIN bank_card AS n ON b.bankAccountId = n.bankAccountId";
  Cswitch().default(() => {
    queryString += " WHERE citizenID = '" + citizenID + "'";
  });
  try {
    await connection.query(queryString).then(result => {
      if (!result[0].length || !citizenID) {
        res.json(warning);
      } else {
        res.json(result[0]);
      }
    });
  } catch {
    res.json(exception);
  }
};

const queryVehiclesByCitizen = async (
  citizenID,
  afterTime,
  beforeTime,
  res
) => {
  // 8728766559 works.
  let queryString =
    "SELECT citizenID, c.forenames, c.surname, vehicleRegistrationNo, timestamp, latitude, longitude FROM citizen AS c " +
    "INNER JOIN vehicle_registrations AS v ON c.surname = v.surname AND c.forenames = v.forenames AND c.dateOfBirth = v.dateOfBirth " +
    "INNER JOIN anpr_observations AS a ON v.vehicleRegistrationNo = a.vehicleRegistrationNumber " +
    "INNER JOIN anpr_camera AS n ON a.ANPRPointId = n.anprId";

  Cswitch()
    .case(afterTime && beforeTime, () => {
      queryString +=
        " WHERE citizenID = '" +
        citizenID +
        "' AND timestamp BETWEEN '" +
        afterTime +
        "' AND '" +
        beforeTime +
        "'";
    })
    .break()
    .case(afterTime, () => {
      queryString +=
        " WHERE citizenID = '" +
        citizenID +
        "' AND timestamp >= '" +
        afterTime +
        "'";
    })
    .break()
    .case(beforeTime, () => {
      queryString +=
        " WHERE citizenID = '" +
        citizenID +
        "' AND timestamp <= '" +
        beforeTime +
        "'";
    })
    .default(() => {
      queryString += " WHERE citizenID = '" + citizenID + "'";
    });

  try {
    await connection.query(queryString).then(result => {
      if (!result[0].length || !citizenID) {
        res.json(warning);
      } else {
        res.json(result[0]);
      }
    });
  } catch {
    res.json(exception);
  }
};

const queryCallsByCitizen = async (
  citizenID,
  afterTime,
  beforeTime,
  inboundOrOutbound,
  res
) => {
  // make nested
  let inbound = false;
  let outbound = false;
  if (inboundOrOutbound == "inbound") {
    inbound = true;
  } else if (inboundOrOutbound == "outbound") {
    outbound = true;
  }

  // 7138293318 works
  let queryOutbound =
    "SELECT receiverMSISDN, s.network, timestamp, latitude AS callerLatitude, longitude AS callerLongitude, " +
    "r.forenames AS receiverForenames, r.surname AS receiverSurname FROM citizen AS c " +
    "INNER JOIN subscriber_records AS s ON c.surname = s.surname AND c.forenames = s.forenames AND c.dateOfBirth = s.dateOfBirth " +
    "INNER JOIN mobile_call_records AS m ON s.phoneNumber = m.callerMSISDN " +
    "INNER JOIN cell_tower AS t ON m.callCellTowerId = t.cellTowerId " +
    "INNER JOIN subscriber_records as r ON r.phoneNumber = m.receiverMSISDN";

  // SELECT receiverMSISDN, s.network, timestamp, latitude AS callerLatitude, longitude AS callerLongitude,
  // r.forenames AS receiverForenames, r.surname AS receiverSurname
  // FROM citizen AS c
  // INNER JOIN subscriber_records AS s ON c.surname = s.surname AND c.forenames = s.forenames AND c.dateOfBirth = s.dateOfBirth
  // INNER JOIN mobile_call_records AS m ON s.phoneNumber = m.callerMSISDN
  // INNER JOIN cell_tower AS t ON m.callCellTowerId = t.cellTowerId
  // INNER JOIN subscriber_records as r ON r.phoneNumber = m.receiverMSISDN;

  // 6724774958 works
  let queryInbound =
    "SELECT callerMSISDN, s.network, timestamp, latitude AS callerLatitude, longitude AS callerLongitude, " +
    "r.forenames AS receiverForenames, r.surname AS receiverSurname FROM citizen AS c " +
    "INNER JOIN subscriber_records AS s ON c.surname = s.surname AND c.forenames = s.forenames AND c.dateOfBirth = s.dateOfBirth " +
    "INNER JOIN mobile_call_records AS m ON s.phoneNumber = m.receiverMSISDN " +
    "INNER JOIN cell_tower AS t ON m.callCellTowerId = t.cellTowerId " +
    "INNER JOIN subscriber_records as r ON r.phoneNumber = m.callerMSISDN";

  // SELECT callerMSISDN, s.network, timestamp, latitude AS callerLatitude, longitude AS callerLongitude,
  //   r.forenames AS callerForenames, r.surname AS callerSurname
  // FROM citizen AS c
  // INNER JOIN subscriber_records AS s ON c.surname = s.surname AND c.forenames = s.forenames AND c.dateOfBirth = s.dateOfBirth
  // INNER JOIN mobile_call_records AS m ON s.phoneNumber = m.receiverMSISDN
  // INNER JOIN cell_tower AS t ON m.callCellTowerId = t.cellTowerId
  // INNER JOIN subscriber_records as r ON r.phoneNumber = m.callerMSISDN;

  let queryString;

  Cswitch()
    .case(inbound, () => {
      queryString = queryInbound;
    })
    .case(outbound, () => {
      queryString = queryOutbound;
    })
    .case(afterTime && beforeTime, () => {
      queryString +=
        " WHERE citizenID = '" +
        citizenID +
        "' AND timestamp BETWEEN '" +
        afterTime +
        "' AND '" +
        beforeTime +
        "'";
    })
    .break()
    .case(afterTime, () => {
      queryString +=
        " WHERE citizenID = '" +
        citizenID +
        "' AND timestamp >= '" +
        afterTime +
        "'";
    })
    .break()
    .case(beforeTime, () => {
      queryString +=
        " WHERE citizenID = '" +
        citizenID +
        "' AND timestamp <= '" +
        beforeTime +
        "'";
    })
    .default(() => {
      queryString += " WHERE citizenID = '" + citizenID + "'";
    });

  try {
    await connection.query(queryString).then(result => {
      if (!result[0].length || !citizenID) {
        res.json(warning);
      } else {
        res.json(result[0]);
      }
    });
  } catch {
    res.json(exception);
  }
};

const queryFinancialsByCitizen = async (
  citizenID,
  afterTime,
  beforeTime,
  eposOrAtm,
  res
) => {
  // Barely any record make it to the final queries. This is due to our sample set not being large enough.
  // 6362899727 and 6488697932 work for epos.
  // None work for atm. Perhaps mock it?

  // make nested
  let epos = false;
  let atm = false;
  if (eposOrAtm == "epos") {
    epos = true;
  } else if (eposOrAtm == "atm") {
    atm = true;
  }

  const atmInitString =
    "SELECT citizenID, c.forenames, c.surname, k.cardNumber, a.timestamp, latitude, longitude, amount FROM citizen AS c ";

  // INNER JOIN bank_account_holders AS b ON c.surname = b.surname AND c.forenames = b.forenames AND c.dateOfBirth = b.dateOfBirth
  // INNER JOIN bank_cards AS k ON b.bankAccountId = k.bankAccountId
  // INNER JOIN epos_transactions AS e on e.bankCardNumber = k.cardNumber
  // INNER JOIN atm_transactions AS a ON a.bankCardNumber = e.bankCardNumber
  // INNER JOIN atm_point as p ON p.atmId = a.atmId
  // LIMIT 5;

  const eposInitString =
    "SELECT citizenID, c.forenames, c.surname, k.cardNumber, e.timestamp, latitude, longitude FROM citizen AS c ";

  // SELECT citizenID, c.forenames, c.surname, k.cardNumber, e.timestamp, latitude, longitude FROM citizen AS c
  // INNER JOIN bank_account_holders AS b ON c.surname = b.surname AND c.forenames = b.forenames AND c.dateOfBirth = b.dateOfBirth
  // INNER JOIN bank_cards AS k ON b.bankAccountId = k.bankAccountId
  // INNER JOIN epos_transactions AS e on e.bankCardNumber = k.cardNumber
  // INNER JOIN epos_terminals as t ON e.eposId = t.id
  // LIMIT 5;

  let queryString =
    "INNER JOIN bank_account_holders AS b ON c.surname = b.surname AND c.forenames = b.forenames AND c.dateOfBirth = b.dateOfBirth " +
    "INNER JOIN bank_card AS k ON b.bankAccountId = k.bankAccountId " +
    "INNER JOIN epos_transactions AS e on e.bankCardNumber = k.cardNumber ";

  Cswitch()
    .case(atm, () => {
      queryString +=
        "INNER JOIN atm_transactions AS a ON a.bankCardNumber = e.bankCardNumber" +
        "INNER JOIN atm_point as p ON p.atmId = a.atmId";
      queryString = atmInitString + queryString;
    })
    .case(epos, () => {
      queryString += "INNER JOIN epos_terminals as t ON e.eposId = t.id";
      queryString = eposInitString + queryString;
    })
    .case(afterTime && beforeTime, () => {
      queryString +=
        " WHERE citizenID = '" +
        citizenID +
        "' AND timestamp BETWEEN '" +
        afterTime +
        "' AND '" +
        beforeTime +
        "'";
    })
    .break()
    .case(afterTime, () => {
      queryString +=
        " WHERE citizenID = '" +
        citizenID +
        "' AND timestamp >= '" +
        afterTime +
        "'";
    })
    .break()
    .case(beforeTime, () => {
      queryString +=
        " WHERE citizenID = '" +
        citizenID +
        "' AND timestamp <= '" +
        beforeTime +
        "'";
    })
    .default(() => {
      queryString += " WHERE citizenID = '" + citizenID + "'";
    });

  try {
    await connection.query(queryString).then(result => {
      if (!result[0].length || !citizenID) {
        res.json(warning);
      } else {
        res.json(result[0]);
      }
    });
  } catch {
    res.json(exception);
  }
};

const queryAssociates = async (citizenID, res) => {
  const queryOutboundAssociateCalls =
    "SELECT c.citizenID, z.citizenID as associateID, z.forenames, z.surname FROM citizen AS c " +
    "INNER JOIN subscriber_records AS s ON c.surname = s.surname AND c.forenames = s.forenames AND c.dateOfBirth = s.dateOfBirth " +
    "INNER JOIN mobile_call_records AS m ON s.phoneNumber = m.callerMSISDN " +
    "INNER JOIN subscriber_records AS r ON r.phoneNumber = m.receiverMSISDN " +
    "INNER JOIN citizen AS z ON r.forenames = z.forenames AND r.surname = z.surname " +
    "WHERE c.citizenID = '" +
    citizenID +
    "'";

  const queryInboundAssociateCalls =
    "SELECT c.citizenID, z.citizenID as associateID, z.forenames, z.surname FROM citizen AS c " +
    "INNER JOIN subscriber_records AS s ON c.surname = s.surname AND c.forenames = s.forenames AND c.dateOfBirth = s.dateOfBirth " +
    "INNER JOIN mobile_call_records AS m ON s.phoneNumber = m.callerMSISDN " +
    "INNER JOIN subscriber_records AS r ON r.phoneNumber = m.receiverMSISDN " +
    "INNER JOIN citizen AS z ON r.forenames = z.forenames AND r.surname = z.surname " +
    "WHERE c.citizenID = '" +
    citizenID +
    "'";

  try {
    await connection
      .query("SELECT * FROM citizen WHERE citizenID LIKE '" + citizenID + "'")
      .then(cit => {
        const surname = cit[0][0].surname;
        const queryPossibleFamily =
          "SELECT * FROM citizen WHERE surname LIKE '" + surname + "%'";

        connection.query(queryPossibleFamily).then(possibleFamily => {
          connection
            .query(queryOutboundAssociateCalls)
            .then(outboundAssociates => {
              connection
                .query(queryInboundAssociateCalls)
                .then(inboundAssociates => {
                  if (
                    (!possibleFamily[0].length &&
                      !outboundAssociates[0].length &&
                      !inboundAssociates[0].length) ||
                    !citizenID
                  ) {
                    res.json(warning);
                  } else {
                    const toReturn = {
                      inboundCallAssociates: inboundAssociates,
                      outboundCallAssociates: outboundAssociates,
                      possibleFamily: possibleFamily
                    };

                    res.json(toReturn);
                  }
                });
            });
        });
      });
  } catch {
    res.json(exception);
  }
};

module.exports = {
  queryCitizenExists,
  queryCitizen,
  queryCitizenById,
  queryBankCardByCitizen,
  queryVehiclesByCitizen,
  queryCallsByCitizen,
  queryFinancialsByCitizen,
  queryAssociates
};
