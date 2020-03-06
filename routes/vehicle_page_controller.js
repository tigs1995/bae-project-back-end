const router = require("express").Router();
const query = require("../queries/queries");

router.post("/getVehicleInfo", ({ body }, res) => {
  query.queryVehicleInfoByReg(body.vehicleRegistrationNo, res);
});

router.post("/getANPRInfo", ({ body }, res) => {
  query.queryANPRInfoByVehReg(body.vehicleRegistrationNo, res);
});


module.exports = router;