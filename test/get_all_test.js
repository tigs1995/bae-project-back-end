const assert = require("assert");
const { warning } = require("../warnings/warnings");
const {
    queryFinancialsAll, queryVehiclesAll
} = require("../queries/get_all_queries");


// getFinancialsAll
describe("All Financials", () => {
    // standard epos
    describe('../queries/get_all_queries.js - queryFinancialsAll("53.74", "-1.64", "10", "2015-05-01T14:03:54.000Z", "2015-05-01T15:11:54.000Z", "epos")', () => {
        it("Should return card number.", () => {
            return queryFinancialsAll("53.74", "-1.64", "10", "2015-05-01T14:03:54.000Z", "2015-05-01T15:11:54.000Z", "epos").then(result => {
                assert.equal(result[0].cardNumber, 5151781328953435);
            });
        });
    });
    // standard epos failure
    describe('../queries/get_all_queries.js - queryFinancialsAll("54.00", "-2.00", "", "2015-05-01T14:03:54.000Z", "2015-05-01T15:11:54.000Z", "epos");', () => {
        it("Should return warning.", () => {
            return queryFinancialsAll("54.00", "-2.00", "ferf54", "2015-05-01T14:03:54.000Z", "2015-05-01T15:11:54.000Z", "epos").then(result => {
                assert.equal(result, warning);
            });
        });
    });
});

// queryVehiclesAll
describe("All Financials", () => {
    describe('../queries/get_all_queries.js - queryVehiclesAll("53.74", "-1.64", "5", "2015-05-01T0:0:00Z", "2015-05-02T0:0:00Z")', () => {
        it("Should return vehicle registration number.", () => {
            return queryVehiclesAll("53.74", "-1.64", "5", "2015-05-01T0:0:00Z", "2015-05-02T0:0:00Z").then(result => {
                assert.equal(result[0].vehicleRegistrationNumber, "UK64 TXQ");
            });
        });
    });
    describe('../queries/get_all_queries.js - queryVehiclesAll("53.74", "-1.64", "5", "2015-05-01T0:0:00Z", "2015-05-02T0:0:00Z");', () => {
        it("Should return warning.", () => {
            return queryVehiclesAll("53.74", "-1.64", "ferf54", "2015-05-01T0:0:00Z", "2015-05-02T0:0:00Z").then(result => {
                assert.equal(result, warning);
            });
        });
    });
});
