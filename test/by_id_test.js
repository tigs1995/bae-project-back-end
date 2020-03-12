const assert = require("assert");
const { queryVehicleInfoByReg } = require("../queries/vehicle_queries");
const { warning, exception } = require("../warnings/warnings");



describe('../queries/vehicle_queries.js - queryVehicleInfoByReg("IT72 YSC");', async () => {
    it("Should return true.", async () => {
      await queryVehicleInfoByReg("IT72 YSC", "#res", true).then(toReturn => {
        console.log(toReturn);
        assert.equal(toReturn.registrationID == 23544, true);
      });
    });
  });
  describe('../queries/vehicle_queries.js - queryVehicle("IT72 EagsdfgFO");', async () => {
    it("Should return a warning.", async () => {
      await queryVehicleInfoByReg("IT72 EagsdfgFO", "#res", true).then(toReturn => {
        console.log(toReturn);
        assert.equal(toReturn, warning);
      });
    });
  });