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

const queryVehiclesAll = async (
  latitude,
  longitude,
  radius,
  afterTime,
  beforeTime,
  res
) => {
  let queryString =
    "SELECT citizenID, c.forenames, c.surname, vehicleRegistrationNo, timestamp, latitude, longitude FROM citizen AS c " +
    "INNER JOIN vehicle_registrations AS v ON c.surname = v.surname AND c.forenames = v.forenames AND c.dateOfBirth = v.dateOfBirth " +
    "INNER JOIN anpr_observations AS a ON v.vehicleRegistrationNo = a.vehicleRegistrationNumber " +
    "INNER JOIN anpr_camera AS n ON a.ANPRPointId = n.anprId";

  Cswitch()
    .case(afterTime && beforeTime, () => {
      queryString +=
        " WHERE timestamp BETWEEN '" + afterTime + "' AND '" + beforeTime + "'";
    })
    .break()
    .case(afterTime, () => {
      queryString += " WHERE timestamp >= '" + afterTime + "'";
    })
    .break()
    .case(beforeTime, () => {
      queryString += " WHERE timestamp <= '" + beforeTime + "'";
    });

  try {
    await connection.query(queryString).then(result => {
      const toSend = filterQueryByRadius(
        result[0],
        latitude,
        longitude,
        radius
      );
      if (!toSend.length) {
        res.json(warning);
      } else {
        res.json(toSend);
      }
    });
  } catch {
    res.json(exception);
  }
};

const queryFinancialsAll = async (
  latitude,
  longitude,
  radius,
  afterTime,
  beforeTime,
  eposOrAtm,
  res
) => {
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
    "INNER JOIN bank_cards AS k ON b.bankAccountId = k.bankAccountId " +
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
        " WHERE timestamp BETWEEN '" + afterTime + "' AND '" + beforeTime + "'";
    })
    .break()
    .case(afterTime, () => {
      queryString += " WHERE timestamp >= '" + afterTime + "'";
    })
    .break()
    .case(beforeTime, () => {
      queryString += " WHERE timestamp <= '" + beforeTime + "'";
    });

  try {
    await connection.query(queryString).then(result => {
      const toSend = filterQueryByRadius(
        result[0],
        latitude,
        longitude,
        radius
      );
      if (!toSend.length) {
        res.json(warning);
      } else {
        res.json(toSend);
      }
    });
  } catch {
    res.json(exception);
  }
};

const queryCallsAll = async (
  latitude,
  longitude,
  radius,
  afterTime,
  beforeTime,
  inboundOrOutbound,
  res
) => {
  // make nested
  let [inbound, outbound] = false;
  if (inboundOrOutbound == "inbound") {
    inbound = true;
  } else if (inboundOrOutbound == "outbound") {
    outbound = true;
  }

  let queryOutbound =
    "SELECT recieverMSISDN, network, timestamp, latitude, longitude, " +
    "r.forenames AS recieverForenames, r.surname AS recieverSurname FROM citizen AS c " +
    "INNER JOIN subscriber_records AS s ON c.surname = s.surname AND c.forenames = s.forenames AND c.dateOfBirth = s.dateOfBirth " +
    "INNER JOIN mobile_call_records AS m ON s.phoneNumber = m.callerMSISDN " +
    "INNER JOIN cell_towers AS t ON m.cellTowerId = t.cellTowerId " +
    "INNER JOIN subscriber_records as r ON r.phoneNumber = m.recieverMSISDN";

  let queryInbound =
    "SELECT r.forenames AS callerForenames, r.surname AS callerSurname, " +
    "callerMSISDN, network, timestamp, latitude, longitude FROM citizen AS c " +
    "INNER JOIN subscriber_records AS s ON c.surname = s.surname AND c.forenames = s.forenames AND c.dateOfBirth = s.dateOfBirth " +
    "INNER JOIN mobile_call_records AS m ON s.phoneNumber = m.reciever " +
    "INNER JOIN cell_towers AS t ON m.cellTowerId = t.cellTowerId" +
    "INNER JOIN subscriber_records as r ON r.phoneNumber = m.callerMSISDN";

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
      const toSend = filterQueryByRadius(
        result[0],
        latitude,
        longitude,
        radius
      );
      if (!toSend.length) {
        res.json(warning);
      } else {
        res.json(toSend);
      }
    });
  } catch {
    res.json(exception);
  }
};

module.exports = { queryVehiclesAll, queryFinancialsAll, queryCallsAll };
