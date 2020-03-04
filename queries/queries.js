const sequelize = require("sequelize");

let queryCitizensBySurname = (surname) => {
    const [results, metadata] = await sequelize.query(
        'SELECT * FROM citizen WHERE surname LIKE ' + surname
    );
    return [results, metadata];
};

function queryFirstLevel(queryType, surname, forenames) {

    let queryVehicleRegByName = (forenames, surname) => {
        const [results, metadata] = await sequelize.query(
            'SELECT * FROM vehicle_registrations WHERE forenames LIKE '
            + forenames + ' AND surname LIKE ' + surname
        );
        return [results, metadata];
    };

    let querySubscriptionByName = (forenames, surname) => {
        const [results, metadata] = await sequelize.query(
            'SELECT * FROM subscriber_records WHERE forenames LIKE '
            + forenames + ' AND surname LIKE ' + surname
        );
        return [results, metadata];
    };

    let queryBankAccByName = (forenames, surname) => {
        const [results, metadata] = await sequelize.query(
            'SELECT * FROM bank_account_holders WHERE forenames LIKE '
            + forenames + ' AND surname LIKE ' + surname
        );
        return [results, metadata];
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

function querySecondLevel(queryType, data) {

    let queryAnprObservations = (vehicleRegistrationNo) => {
        const [results, metadata] = await sequelize.query(
            'SELECT * FROM anpr_bservations WHERE vehicleRegistrationNo LIKE ' + vehicleRegistrationNo
        );
        return [results, metadata];
    };

    let queryMobileCallRecords = (callerMSISDN) => {
        const [results, metadata] = await sequelize.query(
            'SELECT * FROM mobile_call_records WHERE callerMSISDN LIKE ' + callerMSISDN
        );
        return [results, metadata];
    };

    let queryMobileCallRecordsReciever = (receieverMSISDN) => {
        const [results, metadata] = await sequelize.query(
            'SELECT * FROM mobile_call_records WHERE receieverMSISDN LIKE ' + receieverMSISDN
        );
        return [results, metadata];
    };

    let queryEposTransactions = (payeeAccount) => {
        const [results, metadata] = await sequelize.query(
            'SELECT * FROM epos_transactions WHERE payeeAccount LIKE ' + payeeAccount
        );
        return [results, metadata];
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

function queryThirdLevel(queryType, data) {

    let queryTransactionsByBankNumber = (bankCardNumber) => {
        const [results, metadata] = await sequelize.query(
            'SELECT * FROM atm_transactions WHERE bankCardNumber LIKE ' + bankCardNumber
        );
        return [results, metadata];
    };

    let queryEposTerminalsById = (eposId) => {
        const [results, metadata] = await sequelize.query(
            'SELECT * FROM epos_terminals WHERE id LIKE ' + eposId
        );
        return [results, metadata];
    };

    let queryCellTowersByTowerId = (towerId) => {
        const [results, metadata] = await sequelize.query(
            'SELECT * FROM cell_towers WHERE cellTowerId LIKE ' + towerId
        );
        return [results, metadata];
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

function queryFourthLevel(queryType, data) {

    let queryAnprCamera = (anprId) => {
        const [results, metadata] = await sequelize.query(
            'SELECT * FROM anpr_camera WHERE anprId LIKE ' + anprId
        );
        return [results, metadata];
    };

    let queryAtmPoint = (atmId) => {
        const [results, metadata] = await sequelize.query(
            'SELECT * FROM atm_point WHERE atmId LIKE ' + callerMSISDN
        );
        return [results, metadata];
    };

    switch (queryType) {
        case "anpr_camera":
            return queryTransactionsByBankNumber(data);
        case "atm_point":
            return queryEposTerminalsById(data);
    }

}

module.exports = queryFirstLevel;














