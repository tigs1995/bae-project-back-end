const router = require("express").Router();
const query = require("../queries/queries");

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

module.exports = router;
