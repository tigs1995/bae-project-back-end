const assert = require("assert");
const {
    queryVehicleInfoByReg,
    queryANPRInfoByVehReg
} = require("../queries/vehicle_queries");
const {
    queryCitizenById,
    queryBankCardByCitizen,
    queryAssociates,
    queryCallsByCitizen,
    queryFinancialsByCitizen
} = require("../queries/citizen_queries");
const {
    warning
} = require("../warnings/warnings");

//vehicle by reg
describe("Test Queries that take in only an ID or Reg.", function () {
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

//getCitizenCalls
describe("Get calls by citizen", () => {
    //inbound sucess
    describe('../queries/citizen_queries.js - queryCallsByCitizen("6724774958","2015-05-01T09:09:29.000Z","2015-05-01T09:09:30.000Z","inbound");', () => {
        it("Should return caller MSISDN.", () => {
            return queryCallsByCitizen("6724774958", "2015-05-01T09:09:29.000Z", "2015-05-01T09:09:30.000Z", "inbound").then(result => {
                assert.equal(result[0].callerMSISDN, "07700 924376");
            });
        });
    });
    //inbound fail
    describe('../queries/citizen_queries.js - queryCallsByCitizen("6724756465574958","2015-05-01T09:09:29.000Z","2015-05-01T09:09:30.000Z","inbound");', () => {
        it("Should return a warning.", () => {
            return queryCallsByCitizen("6724756465574958", "2015-05-01T09:09:29.000Z", "2015-05-01T09:09:30.000Z", "inbound").then(result => {
                assert.equal(result, warning);
            });
        });
    });
    //outbound sucess
    describe('../queries/citizen_queries.js - queryCallsByCitizen("7138293318","2015-05-01T06:52:04.000Z","2015-05-01T06:52:05.000Z","outbound");', () => {
        it("Should return reciever MSISDN.", () => {
            return queryCallsByCitizen("7138293318","2015-05-01T06:52:04.000Z","2015-05-01T06:52:05.000Z","outbound").then(result => {
                assert.equal(result[0].receiverMSISDN, "07700 190723");
            });
        });
    });
    //outbound fail
    describe('../queries/citizen_queries.js - queryCallsByCitizen("71367655456393908","2015-05-01T06:52:04.000Z","2015-05-01T06:52:05.000Z","outbound");', () => {
        it("Should return a warning.", () => {
            return queryCallsByCitizen("71367655456393908","2015-05-01T06:52:04.000Z","2015-05-01T06:52:05.000Z","outbound").then(result => {
                assert.equal(result, warning);
            });
        });
    });
});

//getCitizenFinancials
describe("Get financials by citizen", () => {
    //epos sucess
    describe('../queries/citizen_queries.js - getCitizenFinancials("9237829918","2015-05-01T14:35:01.000Z","2015-05-01T14:35:02.000Z","epos");', () => {
        it("Should return card number.", () => {
            return queryFinancialsByCitizen("9237829918","2015-05-01T14:35:01.000Z","2015-05-01T14:35:02.000Z","epos").then(result => {
                assert.equal(result[0].cardNumber, "1233798489272791");
            });
        });
    });
    //epos fail
    describe('../queries/citizen_queries.js - getCitizenFinancials("92343657829918","2015-05-01T14:35:01.000Z","2015-05-01T14:35:02.000Z","epos");', () => {
        it("Should return a warning.", () => {
            return queryFinancialsByCitizen("92343657829918","2015-05-01T14:35:01.000Z","2015-05-01T14:35:02.000Z","epos").then(result => {
                assert.equal(result, warning);
            });
        });
    });
    //atm sucess
    describe('../queries/citizen_queries.js - getCitizenFinancials("9237829918","2015-05-01T14:37:20.000Z","2015-05-01T14:37:21.000Z","atm");', () => {
        it("Should return card number.", () => {
            return queryFinancialsByCitizen("9237829918","2015-05-01T14:37:20.000Z","2015-05-01T14:37:21.000Z","atm").then(result => {
                assert.equal(result[0].cardNumber, "1233798489272791");
            });
        });
    });
    //atm fail
    describe('../queries/citizen_queries.js - getCitizenFinancials("9237546357829918","2015-05-01T14:37:20.000Z","2015-05-01T14:37:21.000Z","atm");', () => {
        it("Should return a warning.", () => {
            return queryFinancialsByCitizen("9237546357829918","2015-05-01T14:37:20.000Z","2015-05-01T14:37:21.000Z","atm").then(result => {
                assert.equal(result, warning);
            });
        });
    });
});