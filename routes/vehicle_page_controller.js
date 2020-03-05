const router = require("express").Router();
const query = require("../queries/queries");

router.get("/getVehicleInfo", (req, res) => {
  query
    .queryFirstLevel(
      "vehicle_registrations",
      req.body.fornames,
      req.body.surname
    )
    .then(vehicle => res.json(vehicle));
});
