const router = require("express").Router();
const query = require("../queries/vehicle_queries");

router.post("/vehicleExists", (req, res) => {
  query.queryVehicle(req.body.vehicleRegistrationNo).then(vehicle => {
    try {
      vehicle[0].model;
      res.send(true);
    } catch (error) {
      res.send(false);
    }
  });
});
router.post("/vehicleList", (req, res) => {
  query
    .queryVehicle(req.body.vehicleRegistrationNo)
    .then(vehicle => res.json(vehicle));
});
router.post("/getVehicleInfo", async ({ body }, res) => {
  res.json(await query.queryVehicleInfoByReg(body.vehicleRegistrationNo));
});
router.post("/getANPRInfo", async ({ body }, res) => {
  res.json(await query.queryANPRInfoByVehReg(body.vehicleRegistrationNo));
});
module.exports = router;
