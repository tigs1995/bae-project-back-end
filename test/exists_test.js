const assert = require("assert");
const { queryCitizenExists } = require("../queries/citizen_queries");
const { queryVehicle } = require("../queries/vehicle_queries");

describe('"X" Exists', () => {
  describe('../queries/citizen_queries.js - queryCitizenExists("Hutchinson", "Tony Jason");', () => {
    it("Should return true.", () => {
      queryCitizenExists("Hutchinson", "Tony Jason", "#res", true).then(
        result => {
          assert.equal(result, true);
        }
      );
    });
  });

  describe('../queries/citizen_queries.js - queryCitizenExists("Hutchinson", "Tony Jaagasfgadfason");', () => {
    it("Should return false.", () => {
      queryCitizenExists(
        "Hutchinson",
        "Tony Jaagasfgadfason",
        "#res",
        true
      ).then(result => {
        assert.equal(result, false);
      });
    });
  });

  describe('../queries/vehicle_queries.js - queryVehicle("ZX70 EFO");', () => {
    it("Should return true.", () => {
      queryVehicle("ZX70 EFO").then(result => {
        assert.equal(result.length >= 1, true);
      });
    });
  });

  describe('../queries/vehicle_queries.js - queryVehicle("ZX70 EagsdfgFO");', () => {
    it("Should return true.", () => {
      queryVehicle("ZX70 EagsdfgFO").then(result => {
        assert.equal(result.length >= 1, false);
      });
    });
  });
});
