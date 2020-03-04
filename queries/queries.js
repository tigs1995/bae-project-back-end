const { connection } = require("../server/connect_db");

let queryCitizensBySurname = async (surname) => {
    const results = await connection.query(
        "SELECT * FROM citizen WHERE surname LIKE '%" + surname + "%'"
    );
    return results;
};

async function queryFirstLevel(queryType, surname, forenames) {
    let queryVehicleRegByName = async (forenames, surname) => {
        const results = await connection.query(
            "SELECT * FROM vehicle_registrations WHERE forenames LIKE '%" +
            forenames +
            "%' AND surname LIKE '%" +
            surname +
            "%'"
        );
        return results;
    };

    let querySubscriptionByName = async (forenames, surname) => {
        const results = await connection.query(
            "SELECT * FROM subscriber_records WHERE forenames LIKE '%" +
            forenames +
            "%' AND surname LIKE '%" +
            surname + "%'"
        );
        return results;
    };

    let queryBankAccByName = async (forenames, surname) => {
        const results = await connection.query(
            "SELECT * FROM bank_account_holders WHERE forenames LIKE '%" +
            forenames +
            "%' AND surname LIKE '%" +
            surname + "%'"
        );
        return results;
    };

    switch (queryType) {
        case "vehicle_registrations":
            return queryVehicleRegByName(forenames, surname);
        case "subscriber_records":
            return querySubscriptionByName(forenames, surname);
        case "bank_account_holders":
            return queryBankAccByName(forenames, surname);
    }
}

async function querySecondLevel(queryType, data) {

    let queryAnprObservations = async (vehicleRegistrationNo) => {
        const results = await connection.query(
            'SELECT * FROM anpr_bservations WHERE vehicleRegistrationNo LIKE "' + vehicleRegistrationNo + '"'
        );
        return results;
    };

    let queryMobileCallRecords = async (callerMSISDN) => {
        const results = await connection.query(
            'SELECT * FROM mobile_call_records WHERE callerMSISDN LIKE "' + callerMSISDN + '"'
        );
        return results;
    };

    let queryMobileCallRecordsReciever = async (receieverMSISDN) => {
        const results = await connection.query(
            'SELECT * FROM mobile_call_records WHERE receieverMSISDN LIKE "' + receieverMSISDN + '"'
        );
        return results;
    };

    let queryEposTransactions = async (payeeAccount) => {
        const results = await connection.query(
            'SELECT * FROM epos_transactions WHERE payeeAccount LIKE "' + payeeAccount + '"'
        );
        return results;
    };

    switch (queryType) {
        case "anpr_observations":
            return queryAnprObservations(data);
        case "mobile_call_records":
            return queryMobileCallRecords(data);
        case "mobile_call_records_reciever":
            return queryMobileCallRecordsReciever(data);
        case "epos_transactions":
            return queryEposTransactions(data);
    }

}

async function queryThirdLevel(queryType, data) {

    let queryTransactionsByBankNumber = async (bankCardNumber) => {
        const results = await connection.query(
            'SELECT * FROM atm_transactions WHERE bankCardNumber LIKE "' + bankCardNumber + '"'
        );
        return results;
    };

    let queryEposTerminalsById = async (eposId) => {
        const results = await connection.query(
            'SELECT * FROM epos_terminals WHERE id LIKE "' + eposId + '"'
        );
        return results;
    };

    let queryCellTowersByTowerId = async (towerId) => {
        const results = await connection.query(
            'SELECT * FROM cell_towers WHERE cellTowerId LIKE "' + towerId + '"'
        );
        return results;
    };

    switch (queryType) {
        case "atm_transactions":
            return queryTransactionsByBankNumber(data);
        case "epos_terminals":
            return queryEposTerminalsById(data);
        case "cell_towers":
            return queryCellTowersByTowerId(data);
    }

}

async function queryFourthLevel(queryType, data) {

    let queryAnprCamera = async (anprId) => {
        const results = await connection.query(
            'SELECT * FROM anpr_camera WHERE anprId LIKE "' + anprId + '"'
        );
        return results;
    };

    let queryAtmPoint = async (atmId) => {
        const results = await connection.query(
            'SELECT * FROM atm_point WHERE atmId LIKE "' + callerMSISDN + '"'
        );
        return results;
    };

    switch (queryType) {
        case "anpr_camera":
            return queryTransactionsByBankNumber(data);
        case "atm_point":
            return queryEposTerminalsById(data);
    }

}

module.exports = {
    queryCitizensBySurname,
    queryFirstLevel,
    querySecondLevel,
    queryThirdLevel,
    queryFourthLevel
};