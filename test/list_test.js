const assert = require("assert");
const { queryCitizen } = require("../queries/citizen_queries");
const { queryVehicle } = require("../queries/vehicle_queries");
const { warning, exception } = require("../warnings/warnings");

const tony = {
    citizenID: 2332629551,
    forenames: "Tony",
    surname: "Armstrong",
    streetName: '"34 MARKET STREET',
    city: " STOCKPORT",
    postcode: ' SK6 7AA"',
    dateOfBirth: "1989-06-25",
    placeOfBirth: "RUGBY",
    sex: "Male"
};

describe("Citizen List", () => {
    describe('../queries/citizen_queries.js - queryCitizen("Armstrong", "Tony");', () => {
        it("Should return Tony Armstrong's postcode.", () => {
            return queryCitizen("Armstrong", "Tony", "#res", true).then(result => {
                assert.equal(result[0].postcode, tony.postcode);
            });
        });
    });
    describe('../queries/citizen_queries.js - queryCitizen("Armstrong", "TonBLAHy");', () => {
        it("Should return a warning.", () => {
            return queryCitizen("Armstrong", "TonBLAHy", "#res", true).then(result => {
                assert.equal(result, warning);
            });
        });
    });
});

describe('../queries/vehicle_queries.js - queryVehicle("ZX70 EFO");', () => {
    it("Should return true.", () => {
        return queryVehicle("ZX70 EFO").then(result => {
            assert.equal(result[0].registrationID, 134243);
        });
    });
});
describe('../queries/vehicle_queries.js - queryVehicle("ZX70 EagsdfgFO");', () => {
    it("Should return a warning.", async () => {
        return queryVehicle("ZX70 EagsdfgFO").then(result => {
            assert.equal(result, warning);
        });
    });
});
