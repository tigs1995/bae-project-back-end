const router = require("express").Router();
const { User } = require("../server/connect_db");

router.post("/create", (req, res) => {
  User.create(req.body).then(user => res.json(user));
});

router.get("/getAll", (req, res) => {
  User.findAll().then(user => res.json(user));
});

router.get("/get/:id", (req, res) => {
  let query = User.findAll({
    where: {
      userId: req.params.id
    }
  });
  return query.then(user => res.json(user));
});
