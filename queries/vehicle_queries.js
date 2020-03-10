const { connection } = require("../server/connect_db");
const utm = require("utm");
const Cswitch = require("./conditional_switch");

const warning = { Warning: "No data found or incorrect input." };
const exception = { Exception: "Unknown exception." };

const queryVehicle = async vehicleRegistrationNo => {
  const results = await connection.query(
    "SELECT * FROM vehicle_registrations WHERE vehicleRegistrationNo like '%" +
      vehicleRegistrationNo +
      "%'"
  );
  return results[0];
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
