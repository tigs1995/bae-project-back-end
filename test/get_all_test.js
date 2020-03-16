const assert = require("assert");
const { warning } = require("../warnings/warnings");
const {
    queryFinancialsAll, queryVehiclesAll, queryCallsAll
} = require("../queries/get_all_queries");


// getFinancialsAll
describe("All Financials", () => {
    //epos sucess
    describe('../queries/get_all_queries.js - queryFinancialsAll("53.74", "-1.64", "10", "2015-05-01T14:03:54.000Z", "2015-05-01T15:11:54.000Z", "epos")', () => {
        it("Should return card number.", () => {
            return queryFinancialsAll("53.74", "-1.64", "10", "2015-05-01T14:03:54.000Z", "2015-05-01T15:11:54.000Z", "epos").then(result => {
                assert.equal(result[0].cardNumber, 5151781328953435);
            });
        });
    });
    //epos failure
    describe('../queries/get_all_queries.js - queryFinancialsAll("54.00", "-2.00", "", "2015-05-01T14:03:54.000Z", "2015-05-01T15:11:54.000Z", "epos");', () => {
        it("Should return warning.", () => {
            return queryFinancialsAll("54.00", "-2.00", "ferf54", "2015-05-01T14:03:54.000Z", "2015-05-01T15:11:54.000Z", "epos").then(result => {
                assert.equal(result, warning);
            });
        });
    });
     //atm sucess
     describe('../queries/get_all_queries.js - queryFinancialsAll("53.67", "-1.60", "100.00", "2012-02-05T0:0:00Z", "2018-02-05T0:0:00Z", "atm")', () => {
        it("Should return card number.", () => {
            return queryFinancialsAll("53.67", "-1.60", "100.00", "2012-02-05T0:0:00Z", "2018-02-05T0:0:00Z", "atm").then(result => {
                assert.equal(result[0].cardNumber, 9278653289261932);
            });
        });
    });
    //atm failure
    describe('../queries/get_all_queries.js - queryFinancialsAll("53.67", "-1.60", "100.00", "2012-02-05T0:0:00Z", "2018-02-05T0:0:00Z", "atm");', () => {
        it("Should return warning.", () => {
            return queryFinancialsAll("53.67", "-1.60", "ferf54", "2012-02-05T0:0:00Z", "2018-02-05T0:0:00Z", "atm").then(result => {
                assert.equal(result, warning);
            });
        });
    });
});

// queryVehiclesAll
describe("All Vehicles", () => {
    describe('../queries/get_all_queries.js - queryVehiclesAll("53.74", "-1.64", "5", "2015-05-01T0:0:00Z", "2015-05-02T0:0:00Z")', () => {
        it("Should return vehicle registration number.", () => {
            return queryVehiclesAll("53.74", "-1.64", "5", "2015-05-01T0:0:00Z", "2015-05-02T0:0:00Z").then(result => {
                assert.equal(result[0].vehicleRegistrationNumber, "UK64 TXQ");
            });
        });
    });
    describe('../queries/get_all_queries.js - queryVehiclesAll("53.74", "-1.64", "5", "2015-05-01T0:0:00Z", "2015-05-02T0:0:00Z");', () => {
        it("Should return warning.", () => {
            return queryVehiclesAll("0", "-1.64", "5", "2015-05-01T0:0:00Z", "2015-05-02T0:0:00Z").then(result => {
                assert.equal(result, warning);
            });
        });
    });
});

// queryCallsAll
describe("All Calls", () => {
    //inbound sucess
    describe('../queries/get_all_queries.js - queryCallsAll("53.74", "-1.64", "1000", "2015-05-01T09:03:32.000Z", "2015-05-01T09:03:35.000Z", "inbound")', () => {
        it("Should return caller MSISDN.", () => {
            return queryCallsAll("53.74", "-1.64", "1000", "2015-05-01T09:03:32.000Z", "2015-05-01T09:03:35.000Z", "inbound").then(toSend => {
                assert.equal(toSend[0].callerMSISDN, "07700 033903");
            });
        });
    });
    //inbound fail 
    describe('../queries/get_all_queries.js - queryCallsAll("53.74", "-1.64", "1000", "2015-05-01T09:03:32.000Z", "2015-05-01T09:03:35.000Z", "inbound");', () => {
        it("Should return warning.", () => {
            return queryCallsAll("53.74", "-1.64", "ferf54", "2015-05-01T09:03:32.000Z", "2015-05-01T09:03:35.000Z", "inbound").then(toSend => {
                assert.equal(toSend, warning);
            });
        });
    });
     //outbound sucess
     describe('../queries/get_all_queries.js - queryCallsAll("53.67", "-1.81", "100", "2015-05-01T09:03:32.000Z", "2015-05-01T09:03:35.000Z", "outbound")', () => {
        it("Should return caller MSISDN.", () => {
            return queryCallsAll("53.67", "-1.81", "100", "2015-05-01T09:03:32.000Z", "2015-05-01T09:03:35.000Z", "outbound").then(toSend => {
                assert.equal(toSend[0].callerMSISDN, "07700 805562");
            });
        });
    });
    //outbound fail 
    describe('../queries/get_all_queries.js - queryCallsAll("53.67", "-1.81", "100", "2015-05-01T09:03:32.000Z", "2015-05-01T09:03:35.000Z", "outbound");', () => {
        it("Should return warning.", () => {
            return queryCallsAll("53.67", "-0", "100", "2015-05-01T09:03:32.000Z", "2015-05-01T09:03:35.000Z", "outbound").then(toSend => {
                assert.equal(toSend, warning);
            });
        });
    });
});
