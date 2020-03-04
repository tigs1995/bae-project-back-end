const router = require("express").Router();
const query = require("../queries/queries");

router.get("/getCitizen", (req, res) => {
  query
    .queryCitizen(req.body.surname, req.body.forenames)
    .then(citizen => res.json(citizen));
});

module.exports = router;
