const app = require("express")();
const port = 8080;
const login_controller = require("../routes/login_controller");
const citizen_controller = require("../routes/citizen_controller");
const vehicle_controller = require("../routes/vehicle_controller");
const get_all_controller = require("../routes/get_all_controller");

app.use(require("express").json());

app.use((req, res, next) => {
  const logEntry = `
    host: ${req.hostname}
    ip: ${req.ip}
    method: ${req.method}
    path: ${req.path}
    time: ${new Date()}`;
  console.log(logEntry);
  next();
});

app.use("/login", login_controller);
app.use("/", citizen_controller);
app.use("/", vehicle_controller);
app.use("/", get_all_controller);

const server = app.listen(port, () => {
  console.log(`Server started successfully on port ${port}`);
});

module.exports = server;
