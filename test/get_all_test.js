const assert = require("assert");
const { warning } = require("../warnings/warnings");
const {
    queryFinancialsAll
} = require("../queries/get_all_queries");




//getFinancialsAll
describe("All Financials", () => {
    //standard epos
    describe('../queries/get_all_queries.js - queryFinancialsAll("53.74", "-1.64", "10", "2015-05-01T14:03:54.000Z", "2015-05-01T15:11:54.000Z", "epos");', () => {
        it("Should return card number.", () => {
            queryFinancialsAll("53.74", "-1.64", "10", "2015-05-01T14:03:54.000Z", "2015-05-01T15:11:54.000Z", "epos").then(result => {
                assert.equal(result[0].cardNumber, 5151781328953435);
            });
        });
    });
    //standard epos failure
    describe('../queries/get_all_queries.js - queryFinancialsAll("54.00", "-2.00", "", "2015-05-01T14:03:54.000Z", "2015-05-01T15:11:54.000Z", "epos");', () => {
        it("Should return warning.", () => {
            queryFinancialsAll("54.00", "-2.00", "", "2015-05-01T14:03:54.000Z", "2015-05-01T15:11:54.000Z", "epos").then(result => {
                assert.equal(result, warning);
            });
        });
    });
});
