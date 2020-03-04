const router = require("express").Router();
const query = require("../queries/queries");

router.get("/citizenExists", (req, res) => {
  query.queryCitizen(req.body.surname, req.body.forenames).then(cit => {
    try {
      cit[0].surname;
      res.send(true);
    } catch (error) {
      res.send(false);
    }
  });
});

module.exports = router;
