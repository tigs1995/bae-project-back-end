const { connection } = require("../server/connect_db");
const utm = require("utm");

const { warning, exception } = require("../warnings/warnings");

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

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function filterQueryByRadius(query, latOffset, longOffset, radius) {
  toReturn = [];
  for (let record of query) {
    const r = getDistanceFromLatLonInKm(
      latOffset,
      longOffset,
      record.latitude,
      record.longitude
    );
    if (r <= radius) {
      toReturn.push(record);
    }
  }
  return toReturn;
}

const queryVehiclesAll = async (
  latitude,
  longitude,
  radius,
  afterTime,
  beforeTime,
  res
) => {
  let queryString =
    "SELECT * FROM anpr_camera as cam " +
    "INNER JOIN anpr_observations AS obs ON cam.anprId = obs.ANPRPointId";

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

const queryFinancialsAll = (
  latitude,
  longitude,
  radius,
  afterTime,
  beforeTime,
  eposOrAtm,
  res
) => {
  let epos = false;
  let atm = false;
  if (eposOrAtm == "epos") {
    epos = true;
  } else if (eposOrAtm == "atm") {
    atm = true;
  }
  const atmInitString =
    "SELECT k.cardNumber, a.timestamp, latitude, longitude, a.ammount FROM bank_card AS k ";
  const eposInitString =
    "SELECT k.cardNumber, timestamp, latitude, longitude FROM bank_card AS k ";
  let queryString =
    "INNER JOIN epos_transactions AS e on e.bankCardNumber = k.cardNumber ";
  Cswitch()
    .case(atm, () => {
      queryString +=
        "INNER JOIN atm_transactions AS a ON a.bankCardNumber = e.bankCardNumber" +
        " INNER JOIN atm_point as e ON p.atmId = e.atmId";
      queryString = atmInitString + queryString;
    })
    .case(epos, () => {
      queryString += "INNER JOIN epos_terminals as t ON e.eposId = t.id";
      queryString = eposInitString + queryString;
    })
    .case(afterTime && beforeTime, () => {
      queryString +=
        " WHERE e.timestamp BETWEEN '" + afterTime + "' AND '" + beforeTime + "'";
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
    return connection.query(queryString).then(result => {
      const toSend = filterQueryByRadius(
        result[0],
        latitude,
        longitude,
        radius
      );
      if (!toSend.length) {
        return warning;
      } else {
        return toSend;
      }
    });
  } catch {
    return exception;
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
  let inbound = false;
  let outbound = false;
  if (inboundOrOutbound == "inbound") {
    inbound = true;
  } else if (inboundOrOutbound == "outbound") {
    outbound = true;
  }

  let queryInbound =
    "SELECT callerMSISDN, receiverMSISDN, timestamp, latitude, longitude " +
    "FROM mobile_call_records AS m " +
    "INNER JOIN cell_tower AS t ON t.cellTowerId = m.callCellTowerId";

  let queryOutbound =
    "SELECT callerMSISDN, receiverMSISDN, timestamp, latitude, longitude " +
    "FROM mobile_call_records AS m " +
    "INNER JOIN cell_tower AS t ON t.cellTowerId = m.receiverTowerId";

  Cswitch()
    .case(inbound, () => {
      queryString = queryInbound;
    })
    .case(outbound, () => {
      queryString = queryOutbound;
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

module.exports = { queryVehiclesAll, queryFinancialsAll, queryCallsAll };
