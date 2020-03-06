const router = require("express").Router();
const query = require("../queries/queries");

router.get("/getVehicleInfo", ({ body }, res) => {
  query.queryVehicleInfoByReg(body.vehicleRegistrationNo, res);
});

router.get("/getANPRInfo", ({ body }, res) => {
  query.queryANPRInfoByVehReg(body.vehicleRegistrationNo, res);
});


module.exports = router;