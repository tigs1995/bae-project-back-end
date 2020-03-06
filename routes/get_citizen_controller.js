const router = require("express").Router();
const query = require("../queries/queries");

router.post("/getCitizen", ({ body }, res) => {
  query.queryCitizenById(body.citizenID, res);
});

module.exports = router;
