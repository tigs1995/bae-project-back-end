const assert = require("assert");
const { queryCitizenExists } = require("../queries/citizen_queries");
const { queryVehicle } = require("../queries/vehicle_queries");

describe('"X" Exists', () => {
  describe('../queries/citizen_queries.js - queryCitizenExists("Hutchinson", "Tony Jason");', async () => {
    it("Should return true.", async () => {
      await queryCitizenExists("Hutchinson", "Tony Jason", "#res", true).then(
        result => {
          assert.equal(result, true);
        }
      );
    });
  });

  describe('../queries/citizen_queries.js - queryCitizenExists("Hutchinson", "Tony Jaagasfgadfason");', async () => {
    it("Should return false.", async () => {
      await queryCitizenExists(
        "Hutchinson",
        "Tony Jaagasfgadfason",
        "#res",
        true
      ).then(result => {
        assert.equal(result, false);
      });
    });
  });

  describe('../queries/vehicle_queries.js - queryVehicle("ZX70 EFO");', async () => {
    it("Should return true.", async () => {
      await queryVehicle("ZX70 EFO").then(result => {
        assert.equal(result.length >= 1, true);
      });
    });
  });

  describe('../queries/vehicle_queries.js - queryVehicle("ZX70 EagsdfgFO");', async () => {
    it("Should return true.", async () => {
      await queryVehicle("ZX70 EagsdfgFO").then(result => {
        assert.equal(result.length >= 1, false);
      });
    });
  });
});
