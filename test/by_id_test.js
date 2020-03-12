const assert = require("assert");
const { queryVehicleInfoByReg } = require("../queries/vehicle_queries");
const {
  queryCitizenById,
  queryBankCardByCitizen
} = require("../queries/citizen_queries");
const { warning } = require("../warnings/warnings");

//vehicle by reg
describe("Test Queries that take in only an ID or Reg.", function() {
  this.timeout(10000);
  describe('../queries/vehicle_queries.js - queryVehicleInfoByReg("IT72 YSC");', async () => {
    it("Should return true.", async () => {
      await queryVehicleInfoByReg("IT72 YSC").then(toReturn => {
        assert.equal(toReturn.registrationID, 23544);
      });
    });
  });
  describe('../queries/vehicle_queries.js - queryVehicleInfoByReg("IT72 EagsdfgFO");', async () => {
    it("Should return a warning.", async () => {
      await queryVehicleInfoByReg("IT72 EagsdfgFO").then(toReturn => {
        assert.equal(toReturn, warning);
      });
    });
  });

  //citizen by id
  describe('../queries/citizen_queries.js - queryCitizenById("2332629551");', async () => {
    it("Should return Tony Armstrong.", async () => {
      await queryCitizenById("2332629551").then(toReturn => {
        assert.equal(toReturn.forenames, "Tony");
      });
    });
  });
  describe('../queries/citizen_queries.js - queryCitizenById("23326295510000");', async () => {
    it("Should return a warning.", async () => {
      await queryCitizenById("23326295510000").then(toReturn => {
        assert.equal(toReturn, warning);
      });
    });
  });

  //bank card by citizenID
  describe('../queries/citizen_queries.js - queryBankCardByCitizen("9237829918");', async () => {
    it("Should return Bob Campbell.", async () => {
      await queryBankCardByCitizen("9237829918").then(toReturn => {
        assert.equal(toReturn[0].forenames, "Bob");
      });
    });
  });
  describe('../queries/citizen_queries.js - queryBankCardByCitizen("23326295510000");', async () => {
    it("Should return a warning.", async () => {
      await queryCitizenById("23326295510000").then(toReturn => {
        assert.equal(toReturn, warning);
      });
    });
  });
});
