const router = require("express").Router();
const query = require("../queries/queries");

router.post("/getVehiclesAll", ({ body }, res) => {
  query.queryVehiclesAll(body.latitude, body.longitude, body.radius, body.afterTime, body.beforeTime, res);
});

router.post("/getFinancialsAll", ({ body }, res) => {
  query.queryFinancialsAll(body.latitude, body.longitude, body.radius, body.afterTime, body.beforeTime, body.eposOrAtm, res);
});

router.post("/getCallsAll", ({ body }, res) => {
  query.queryCallsAll(body.latitude, body.longitude, body.radius, body.afterTime, body.beforeTime, body.inboundOrOutbound, res);
});

module.exports = router;