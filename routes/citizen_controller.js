const router = require("express").Router();
const query = require("../queries/queries");

router.post("/citizenExists", (req, res) => {
    query.queryCitizen(req.body.surname, req.body.forenames, res);
});

router.post("/citizenList", (req, res) => {
    query.queryCitizen(req.body.surname, req.body.forenames, res)
});

router.post("/getCitizen", ({ body }, res) => {
    query.queryCitizenById(body.citizenID, res);
});

router.post("/getBankCardInfo", ({ body }, res) => {
    query.queryBankCardByCitizen(body.citizenID, res);
});

router.post("/getCitizenCalls", ({ body }, res) => {
    query.queryCallsByCitizen(body.citizenID, body.afterTime, body.beforeTime, body.inboundOrOutbound, res);
});

router.post("/getCitizenFinancials", ({ body }, res) => {
    query.queryFinancialsByCitizen(body.citizenID, body.afterTime, body.beforeTime, body.eposOrAtm, res);
});

router.post("/getCitizenVehicles", ({ body }, res) => {
    query.queryVehiclesByCitizen(body.citizenID, body.afterTime, body.beforeTime, res);
});

router.post("/getAssociates", ({ body }, res) => {
    query.queryAssociates(body.citizenID, res);
});
module.exports = router;