const router = require("express").Router();
const query = require("../queries/citizen_queries");

router.post("/citizenExists", (req, res) => {
  query.queryCitizenExists(req.body.surname, req.body.forenames, res);
});

router.post("/citizenList", (req, res) => {
  query.queryCitizen(req.body.surname, req.body.forenames, res);
});

router.post("/getCitizen", async ({ body }, res) => {
  res.json(await query.queryCitizenById(body.citizenID, res));
});

router.post("/getBankCardInfo", async ({ body }, res) => {
  res.json(await query.queryBankCardByCitizen(body.citizenID, res));
});

router.post("/getCitizenCalls", ({ body }, res) => {
  query.queryCallsByCitizen(
    body.citizenID,
    body.afterTime,
    body.beforeTime,
    body.inboundOrOutbound,
    res
  );
});

router.post("/getCitizenFinancials", ({ body }, res) => {
  query.queryFinancialsByCitizen(
    body.citizenID,
    body.afterTime,
    body.beforeTime,
    body.eposOrAtm,
    res
  );
});

router.post("/getCitizenVehicles", ({ body }, res) => {
  query.queryVehiclesByCitizen(
    body.citizenID,
    body.afterTime,
    body.beforeTime,
    res
  );
});

router.post("/getAssociates", async ({ body }, res) => {
  res.json(await query.queryAssociates(body.citizenID, res));
});
module.exports = router;
