const router = require("express").Router();
const { User } = require("../server/connect_db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateLoginInput = require("../validation/login");

router.post("/", async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const username = req.body.username;
  const password = req.body.password;

  let currentUser = await User.findOne({
    where: {
      username: username
    }
  });
  if (!currentUser) {
    return res.status(404).json({
      usernotfound: "sorry user not in our db"
    });
  }

  if (bcrypt.compareSync(password, currentUser.password)) {
    const payload = {
      id: currentUser.id,
      username: currentUser.username
    };

    jwt.sign(
      payload,
      keys.secretOrKey,
      {
        expiresIn: 31556926
      },
      (err, token) => {
        res.json({
          success: true,
          token: "Bearer " + token
        });
      }
    );
  } else {
    return res
      .status(400)
      .json({ passwordincorrect: "Your username or password is incorrect" });
  }
});

router.post("/create", (req, res) => {
  User.create(req.body).then(user => res.json(user));
});

router.get("/getAll", (req, res) => {
  User.findAll().then(user => res.json(user));
});

router.get("/get", (req, res) => {
  let query = User.findOne({
    where: {
      username: username,
      password: password
    }
  });
  return query.then(user => res.json(user));
});

module.exports = router;
