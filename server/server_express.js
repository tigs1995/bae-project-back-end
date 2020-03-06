const app = require("express")();
const db = require("./connect_db");
const login_controller = require("../routes/login_controller");
const cit_search_controller = require("../routes/citizen_list_controller");
const vehicle_list_controller = require("../routes/vehicle_list_controller");
const vehicle_page_controller = require("../routes/vehicle_page_controller");
const location_page_controller = require("../routes/location_page_controller");
const cit_exists = require("../routes/citizen_check_controller");
const vehicle_exists = require("../routes/vehicle_check_controller");
const get_citizen = require("../routes/get_citizen_controller");
const port = 8080;

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
app.use("/", cit_search_controller);
app.use("/", vehicle_list_controller);
app.use("/", vehicle_page_controller);
app.use("/", location_page_controller);
app.use("/", cit_exists);
app.use("/", vehicle_exists);
app.use("/", get_citizen);

const server = app.listen(port, () => {
  console.log(`Server started successfully on port ${port}`);
});

module.exports = server;
