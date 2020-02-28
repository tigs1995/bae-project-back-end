const app = require('express')();
const db = require("./connect_db");
const login_controller = require("../routes/login_controller");
const port = 8080;

app.use(require("express").json());

app.use((req, res, next) => {
    const logEntry =
        `
    host: ${req.hostname}
    ip: ${req.ip}
    method: ${req.method}
    path: ${req.path}
    time: ${new Date()}`;
    console.log(logEntry);
    next();
});

app.use("/login", login_controller);

const server = app.listen(port, () => {
    console.log(`Server started successfully on port ${port}`);
});

module.exports = server;
