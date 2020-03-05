const router = require("express").Router();
const query = require("../queries/queries");

router.get("/getVehicleInfo", ({ body }, res) => {
  query.queryVehicleInfoByReg(body.vehicleRegistrationNo)
  .then(vehicle => res.json(vehicle));
});

router.get("/getANPRInfo", ({ body }, res) => {
  query.queryANPRInfoByVehReg(body.vehicleRegistrationNo)
  .then(vehicle => res.json(vehicle));
});


module.exports = router;