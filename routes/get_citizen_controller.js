const router = require("express").Router();
const query = require("../queries/queries");

router.get("/getCitizen", ({ body }, res) => {
  query.queryCitizenById(body.citizenId).then(citizen => res.json(citizen));
});

module.exports = router;
