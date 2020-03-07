const router = require("express").Router();
const query = require("../queries/queries");

router.post("/getCitizenVehicles", ({ body }, res) => {
  query.queryVehiclesByCitizen(body.citizenID, body.afterTime, body.beforeTime, res);
});

module.exports = router;