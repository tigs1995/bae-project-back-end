const { connection } = require("../server/connect_db");
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

const queryVehicle = async vehicleRegistrationNo => {
  try {
    const results = await connection.query(
      "SELECT * FROM vehicle_registrations WHERE vehicleRegistrationNo like '%" +
        vehicleRegistrationNo +
        "%'"
    );
    if (results[0].length) {
      return results[0];
    } else {
      return warning;
    }
  } catch {
    return exception;
  }
};

const queryVehicleInfoByReg = async (vehicleRegistrationNo, res) => {
  try {
    await connection
      .query(
        "SELECT * FROM vehicle_registrations WHERE vehicleRegistrationNo LIKE '" +
          vehicleRegistrationNo +
          "'"
      )
      .then(veh => {
        try {
          connection
            .query(
              "SELECT * FROM citizen WHERE forenames LIKE '" +
                veh[0][0].forenames +
                "' AND surname LIKE '" +
                veh[0][0].surname +
                "' AND dateOfBirth LIKE '" +
                veh[0][0].dateOfBirth +
                "'"
            )
            .then(cit => {
              const toReturn = {
                forenames: veh[0][0].forenames,
                surname: veh[0][0].surname,
                citizenID: cit[0][0].citizenID,
                registrationID: veh[0][0].registrationID,
                registrationDate: veh[0][0].registrationDate,
                vehicleRegistrationNo: veh[0][0].vehicleRegistrationNo,
                make: veh[0][0].make,
                model: veh[0][0].model,
                colour: veh[0][0].colour,
                driverLicenceID: veh[0][0].driverLicenceID
              };

              res.json(toReturn);
            });
        } catch {
          res.json(Warning);
        }
      });
  } catch {
    res.json(Warning);
  }
};

const queryANPRInfoByVehReg = async (vehicleRegistrationNo, res) => {
  let queryString =
    "SELECT timestamp, streetName, latitude, longitude, vehicleRegistrationNo FROM vehicle_registrations AS v " +
    "INNER JOIN anpr_observations AS a ON v.vehicleRegistrationNo = a.vehicleRegistrationNumber " +
    "INNER JOIN anpr_camera AS n ON a.ANPRPointId = n.anprId";
  Cswitch().default(() => {
    queryString +=
      " WHERE vehicleRegistrationNo = '" + vehicleRegistrationNo + "'";
  });
  try {
    await connection.query(queryString).then(result => {
      if (!result[0].length || !vehicleRegistrationNo) {
        res.json(warning);
      } else {
        res.json(result[0]);
      }
    });
  } catch {
    res.json(exception);
  }
};

module.exports = { queryVehicle, queryANPRInfoByVehReg, queryVehicleInfoByReg };
