const router = require("express").Router();
const query = require("../queries/queries");

router.get("/getCitizen", (req, res) => {
  query.queryCitizenById(req.body.citizenId).then();
});

module.exports = router;
