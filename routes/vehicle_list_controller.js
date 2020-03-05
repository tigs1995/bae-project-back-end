const router = require("express").Router();
const query = require("../queries/queries");

router.get("/vehicleList", (req, res) => {
  query
    .queryVehicle(req.body.vehicleRegistrationNo)
    .then(vehicle => res.json(vehicle));
});

module.exports = router;
