const router = require("express").Router();
const query = require("../queries/queries");

router.post("/getCitizenVehicles", ({ body }, res) => {
  query.queryVehiclesByCitizen(body.citizenID, body.afterTime, body.beforeTime, res);
});

router.post("/getVehiclesAll", ({ body }, res) => {
  query.queryVehiclesAll(body.afterTime, body.beforeTime, body.latitude, body.longitude, body.radius, res);
});

router.post("/getCitizenFinancials", ({ body }, res) => {
  query.queryFinancialsByCitizen(body.citizenID, body.afterTime, body.beforeTime, body.eposOrAtm, res);
});

router.post("/getFinancialsAll", ({ body }, res) => {
  query.queryFinancialsAll(body.afterTime, body.beforeTime, body.latitude, body.longitude, body.radius, res);
});

router.post("/getCitizenCalls", ({ body }, res) => {
  query.queryCallsByCitizen(body.citizenID, body.afterTime, body.beforeTime, res);
});

router.post("/getCallsAll", ({ body }, res) => {
  query.queryCallsAll(body.afterTime, body.beforeTime, body.latitude, body.longitude, body.radius, res);
});

module.exports = router;