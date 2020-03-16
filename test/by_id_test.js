const assert = require("assert");
const {
  queryVehicleInfoByReg,
  queryANPRInfoByVehReg
} = require("../queries/vehicle_queries");
const {
  queryCitizenById,
  queryBankCardByCitizen,
  queryAssociates
} = require("../queries/citizen_queries");
const { warning } = require("../warnings/warnings");

//vehicle by reg
describe("Test Queries that take in only an ID or Reg.", function () {
  this.timeout(20000);
  describe('../queries/vehicle_queries.js - queryVehicleInfoByReg("IT72 YSC");', () => {
    it("Should return true.", () => {
      return queryVehicleInfoByReg("IT72 YSC").then(toReturn => {
        assert.equal(toReturn.registrationID, 23544);
      });
    });
  });
  describe('../queries/vehicle_queries.js - queryVehicleInfoByReg("IT72 EagsdfgFO");', () => {
    it("Should return a warning.", () => {
      return queryVehicleInfoByReg("IT72 EagsdfgFO").then(toReturn => {
        assert.equal(toReturn, warning);
      });
    });
  });

  //citizen by id
  describe('../queries/citizen_queries.js - queryCitizenById("2332629551");', () => {
    it("Should return Tony Armstrong.", () => {
      return queryCitizenById("2332629551").then(toReturn => {
        assert.equal(toReturn.forenames, "Tony");
      });
    });
  });
  describe('../queries/citizen_queries.js - queryCitizenById("23326295510000");', () => {
    it("Should return a warning.", () => {
      return queryCitizenById("23326295510000").then(toReturn => {
        assert.equal(toReturn, warning);
      });
    });
  });

  //bank card by citizenID
  describe('../queries/citizen_queries.js - queryBankCardByCitizen("9237829918");', () => {
    it("Should return Bob Campbell.", () => {
      return queryBankCardByCitizen("9237829918").then(toReturn => {
        assert.equal(toReturn[0].forenames, "Bob");
      });
    });
  });
  describe('../queries/citizen_queries.js - queryBankCardByCitizen("23326295510000");', () => {
    it("Should return a warning.", () => {
      return queryCitizenById("23326295510000").then(toReturn => {
        assert.equal(toReturn, warning);
      });
    });
  });

  //anprInfoByVehReg
  describe("Vehicle ANPR Info", () => {
    describe('../queries/vehicle_queries.js - queryANPRInfoByVehReg("JU10 ECY");', () => {
      it("Should return latitude.", () => {
        return queryANPRInfoByVehReg("JU10 ECY").then(result => {
          assert.equal(result[0].latitude, 51.5213482421938);
        });
      });
    });
    describe('../queries/vehicle_queries.js - queryANPRInfoByVehReg("JU10 EagsdfgFO");', () => {
      it("Should return a warning.", () => {
        return queryANPRInfoByVehReg("JU10 EagsdfgFO").then(result => {
          assert.equal(result, warning);
        });
      });
    });
  });

  //get associates
  describe("Get Associates", () => {
    describe('../queries/citizen_queries.js - queryAssociates("9237829919");', () => {
      it("Should return Selena's possible associates.", () => {
        return queryAssociates("9237829919").then(result => {
          assert.equal(result.possibleFamily[0].citizenID, 7855594543);
        });
      });
    });

    describe('../queries/citizen_queries.js - queryAssociates("banana");', () => {
      it("Should return a warning.", () => {
        return queryAssociates("banana").then(result => {
          console.log(result);
          assert.equal(result, warning);
        });
      });
    });
  });
});
