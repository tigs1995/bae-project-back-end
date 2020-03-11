const assert = require('assert');
const citizen = require("../queries/citizen_queries");
const vehicle = require("../queries/vehicle_queries");

describe('"X" Exists', () => {

  describe('../queries/citizen_queries.js - queryCitizenExists("Hutchinson", "Tony Jason");', async () => {
    it('Should return true.', async () => {
      await citizen.queryCitizenExists("Hutchinson", "Tony Jason", "#res", true)
        .then(result => {
          assert.equal(result, true);
        }
        );
    });
  });

  describe('../queries/citizen_queries.js - queryCitizenExists("Hutchinson", "Tony Jaagasfgadfason");', async () => {
    it('Should return false.', async () => {
      await citizen.queryCitizenExists("Hutchinson", "Tony Jaagasfgadfason", "#res", true)
        .then(result => {
          assert.equal(result, false);
        }
        );
    });
  });

  describe('../queries/vehicle_queries.js - queryVehicle("ZX70 EFO");', async () => {
    it('Should return true.', async () => {
      await vehicle.queryVehicle("ZX70 EFO")
        .then(result => {
          assert.equal(result.length >= 1, true);
        });
    });
  });

  describe('../queries/vehicle_queries.js - queryVehicle("ZX70 EagsdfgFO");', async () => {
    it('Should return true.', async () => {
      await vehicle.queryVehicle("ZX70 EagsdfgFO")
        .then(result => {
          assert.equal(result.length >= 1, false);
        });
    });
  });

});