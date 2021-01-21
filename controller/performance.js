let models = require('../models');
var sequelize = require('sequelize');
// var mydb = new sequelize('database', 'username', 'password');
const db = require('../models/index');
var winston = require('../logs/winston');
var CONST = require('../const');
const op = sequelize.Op;
const moment = require("moment");
const { isHttpError } = require('http-errors');

exports.get_performance_overall = function (req, res, next) {
    const getPerf_PO_overall = (req, res, next) => {
        return new Promise((resolve, reject) => {
            return db.sequelize
                .query('SELECT * from F_GET_PERF_PO(:a)', {
                    replacements: {
                        a: null
                    }
                })
                .then(data => {
                    resolve(data[0]);
                }).catch(err => {
                    reject(err);
                });
        })
    }

    const getPerf_PSR_overall = (req, res, next) => {
        return new Promise((resolve, reject) => {
            return db.sequelize
                .query('SELECT * from F_GET_PERF_PSR(:a)', {
                    replacements: {
                        a: null
                    }
                })
                .then(data => {
                    resolve(data[0]);
                }).catch(err => {
                    reject(err);
                });
        })
    }

    const getPerf_PO_user = (req, res, next) => {
        return new Promise((resolve, reject) => {
            return db.sequelize
                .query('SELECT * from F_GET_PERF_PO(:a)', {
                    replacements: {
                        a: (req.user.id == null ? null : req.user.id),
                        // a: '13aeef10-eb77-4d35-8dbb-4fc7ef84d25e' // t4
                        // a: '5bf8419c-2b52-485c-b01e-ed82c89f069a' //t1
                        // a: '1b578a15-8c04-47f3-87de-cb7e4f06c281' //t3
                    }
                })
                .then(data => {
                    resolve(data[0]);
                }).catch(err => {
                    reject(err);
                });
        })
    }

    const getPerf_PSR_user = (req, res, next) => {
        return new Promise((resolve, reject) => {
            return db.sequelize
                .query('SELECT * from F_GET_PERF_PSR(:a)', {
                    replacements: {
                        a: (req.user.id == null ? null : req.user.id),
                        // a: '13aeef10-eb77-4d35-8dbb-4fc7ef84d25e' //t4
                        // a: '5bf8419c-2b52-485c-b01e-ed82c89f069a' //t1
                        // a: '1b578a15-8c04-47f3-87de-cb7e4f06c281' //t3
                    }
                })
                .then(data => {
                    resolve(data[0]);
                }).catch(err => {
                    reject(err);
                });
        })
    }

    Promise.all([getPerf_PO_overall(req, res), getPerf_PSR_overall(req, res), getPerf_PO_user(req, res), getPerf_PSR_user(req, res)])
        .then(result => {
            let year = req.body.year == null ? (new Date()).getFullYear() : req.body.year;

            let po = result[0];
            let psr = result[1];
            let usr_po = result[2];
            let usr_psr = result[3];

            let po_result = po.filter(x => (new Date(x.time_created)).getFullYear() == year);
            let psr_result = psr.filter(x => (new Date(x.time_created)).getFullYear() == year);
            let user_po_result = usr_po.filter(x => (new Date(x.time_created)).getFullYear() == year);
            let user_psr_result = usr_psr.filter(x => (new Date(x.time_created)).getFullYear() == year);
            console.log(user_po_result)

            console.log((new Date(po[0].time_created)).getFullYear())

            let overall = {};
            let user = {};

            //split by months
            for (var i = 0; i < 12; i++) {
                let tmp_po = po_result.filter(x =>
                    (new Date(x.time_created)).getMonth() == i
                )
                let tmp_psr = psr_result.filter(x =>
                    (new Date(x.time_created)).getMonth() == i
                )

                let tmp_average_po = getAverageTime(calculateTotalTime(tmp_po), tmp_po.length)
                let tmp_average_psr = getAverageTime(calculateTotalTime(tmp_psr), tmp_psr.length)
                let po_decline = calculateDeclines(tmp_po);
                let psr_decline = calculateDeclines(tmp_psr);

                let po_efficiency = ((tmp_po.length - po_decline) / tmp_po.length) * 100;
                let psr_efficiency = ((tmp_psr.length - psr_decline) / tmp_psr.length) * 100;

                overall[i] = ({ total_po: tmp_po.length, total_po_decline: po_decline, po_efficiency, tmp_average_po, total_psr: tmp_psr.length, total_psr_decline: psr_decline, psr_efficiency, tmp_average_psr });

                let tmp_usr_po = user_po_result.filter(x =>
                    (new Date(x.time_created)).getMonth() == i
                )
                let tmp_usr_psr = user_psr_result.filter(x =>
                    (new Date(x.time_created)).getMonth() == i
                )

                let tmp_usr_average_po = getAverageTime(calculateTotalTime(tmp_usr_po), tmp_usr_po.length)
                let tmp_usr_average_psr = getAverageTime(calculateTotalTime(tmp_usr_psr), tmp_usr_psr.length)
                let usr_po_decline = calculateDeclines(tmp_usr_po);
                let usr_psr_decline = calculateDeclines(tmp_usr_psr);

                let usr_po_efficiency = ((tmp_usr_po.length - usr_po_decline) / tmp_usr_po.length) * 100;
                let usr_psr_efficiency = ((tmp_usr_psr.length - usr_psr_decline) / tmp_usr_psr.length) * 100;

                user[i] = ({ total_po: tmp_usr_po.length, total_usr_po_decline: usr_po_decline, usr_po_efficiency, tmp_usr_average_po, total_psr: tmp_usr_psr.length, total_usr_psr_decline: usr_psr_decline, usr_psr_efficiency, tmp_usr_average_psr });
            }

            res.status(200).send({ overall, user });
        }).catch(err => {
            winston.error({
                level: 'error',
                label: 'performance',
                message: err
            })
            res.status(500).send(err);
        })
}

exports.get_all_user_performance = async (req, res, next) => {
    const getAllUsers = async () => {
        return models.Users.findAll({
            attributes: ['id', 'username', 'firstname', 'lastname', 't1', 't2', 't3', 't4', 'is_admin', 'acct_t'],
            include: [
                {
                    model: models.department,
                    required: false,
                    as: 'department',
                    attributes: ['cd']
                },
                {
                    model: models.branch,
                    required: true,
                    as: 'branch',
                    attributes: ['cd']
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ],
            where: {
                acct_t: false,
                is_admin: false
            }
        }).catch(err => {
            winston.error({
                level: 'error',
                label: 'perf_get_all_user',
                message: err
            })
            console.log(err);
        })
    }

    const get_po_performance = async (user_id) => {
        return db.sequelize
            .query('SELECT * from F_GET_PERF_PO(:a)', {
                replacements: {
                    a: user_id
                }
            }).catch(err => {
                console.log(err);
            });
    }

    const get_psr_performance = async (user_id) => {
        return db.sequelize
            .query('SELECT * from F_GET_PERF_PSR(:a)', {
                replacements: {
                    a: user_id
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    let userTmp = await getAllUsers();
    let user_data = [];
    let year = req.body.year == null ? (new Date()).getFullYear : req.body.year;

    for (let index = 0; index < userTmp.length; index++) {
        console.log(userTmp[index].id)

        let psr = await get_psr_performance(userTmp[index].id);
        let po = await get_po_performance(userTmp[index].id);

        let psr_result = psr[0].filter(x => (new Date(x.time_created)).getFullYear() == year);
        let po_result = po[0].filter(x => (new Date(x.time_created)).getFullYear() == year);

        let usr_perf = [];

        for (let i = 0; i < 12; i++) {
            let tmp_psr = psr_result.filter(x => (new Date(x.time_created)).getMonth() == i);
            let tmp_po = po_result.filter(x => (new Date(x.time_created)).getMonth() == i);
            

            let tmp_average_po = getAverageTime(calculateTotalTime(tmp_po), tmp_po.length)
            let tmp_average_psr = getAverageTime(calculateTotalTime(tmp_psr), tmp_psr.length)
            let po_decline = calculateDeclines(tmp_po);
            let psr_decline = calculateDeclines(tmp_psr);

            let po_efficiency = ((tmp_po.length - po_decline) / tmp_po.length) * 100;
            let psr_efficiency = ((tmp_psr.length - psr_decline) / tmp_psr.length) * 100;

            usr_perf[i] = ({ 
                total_po: tmp_po.length, 
                total_po_decline: po_decline, 
                po_efficiency, tmp_average_po, 
                total_psr: tmp_psr.length, 
                total_psr_decline: psr_decline, 
                psr_efficiency, tmp_average_psr 
            });
        }

        let tmp = {
            id: userTmp[index].id,
            username: userTmp[index].username,
            firstname: userTmp[index].firstname,
            lastname: userTmp[index].lastname,
            t1: userTmp[index].t1,
            t2: userTmp[index].t2,
            t3: userTmp[index].t3,
            t4: userTmp[index].t4,
            is_admin: userTmp[index].is_admin,
            acct_t: userTmp[index].acct_t,
            performance: usr_perf
        }
        user_data.push(tmp);
    }

    try {
        res.status(200).send({users: userTmp, user_data: user_data});
    } catch (err) {
        res.status(400).send(err);
    }



}

function calculateDeclines(data) {
    try {
        let tmp = 0;
        for (const i in data) {
            // console.log(data[i].status_decline)
            if (data[i].status_decline) tmp++;
        }

        return tmp;
    } catch (err) {
        console.log(err)
        return err
    }
}

function calculateTotalTime(data) {
    try {
        let tmp_result = {
            total_age_pending_1: {
                months: 0,
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            },
            total_age_pending_2: {
                months: 0,
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            },
            total_age_approve: {
                months: 0,
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            },
            total_age_decline: {
                months: 0,
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            },
        };

        for (const i in data) {
            if (data[i].age_time_pending_1 != null) {
                tmp_result.total_age_pending_1.months = trycatchCalculate(tmp_result.total_age_pending_1.months, data[i].age_time_pending_1.months);
                tmp_result.total_age_pending_1.days = trycatchCalculate(tmp_result.total_age_pending_1.days, data[i].age_time_pending_1.days);
                tmp_result.total_age_pending_1.hours = trycatchCalculate(tmp_result.total_age_pending_1.hours, data[i].age_time_pending_1.hours);
                tmp_result.total_age_pending_1.minutes = trycatchCalculate(tmp_result.total_age_pending_1.minutes, data[i].age_time_pending_1.minutes);
                tmp_result.total_age_pending_1.seconds = trycatchCalculate(tmp_result.total_age_pending_1.seconds, data[i].age_time_pending_1.seconds);
            }

            if (data[i].age_time_pending_2 != null) {
                tmp_result.total_age_pending_2.months = trycatchCalculate(tmp_result.total_age_pending_2.months, data[i].age_time_pending_2.months);
                tmp_result.total_age_pending_2.days = trycatchCalculate(tmp_result.total_age_pending_2.days, data[i].age_time_pending_2.days);
                tmp_result.total_age_pending_2.hours = trycatchCalculate(tmp_result.total_age_pending_2.hours, data[i].age_time_pending_2.hours);
                tmp_result.total_age_pending_2.minutes = trycatchCalculate(tmp_result.total_age_pending_2.minutes, data[i].age_time_pending_2.minutes);
                tmp_result.total_age_pending_2.seconds = trycatchCalculate(tmp_result.total_age_pending_2.seconds, data[i].age_time_pending_2.seconds);
            }

            if (data[i].age_time_approve != null) {
                tmp_result.total_age_approve.months = trycatchCalculate(tmp_result.total_age_approve.months, data[i].age_time_approve.months);
                tmp_result.total_age_approve.days = trycatchCalculate(tmp_result.total_age_approve.days, data[i].age_time_approve.days);
                tmp_result.total_age_approve.hours = trycatchCalculate(tmp_result.total_age_approve.hours, data[i].age_time_approve.hours);
                tmp_result.total_age_approve.minutes = trycatchCalculate(tmp_result.total_age_approve.minutes, data[i].age_time_approve.minutes);
                tmp_result.total_age_approve.seconds = trycatchCalculate(tmp_result.total_age_approve.seconds, data[i].age_time_approve.seconds);
            }

            if (data[i].age_time_decline != null) {
                tmp_result.total_age_decline.months = trycatchCalculate(tmp_result.total_age_decline.months, data[i].age_time_decline.months);
                tmp_result.total_age_decline.days = trycatchCalculate(tmp_result.total_age_decline.days, data[i].age_time_decline.days);
                tmp_result.total_age_decline.hours = trycatchCalculate(tmp_result.total_age_decline.hours, data[i].age_time_decline.hours);
                tmp_result.total_age_decline.minutes = trycatchCalculate(tmp_result.total_age_decline.minutes, data[i].age_time_decline.minutes);
                tmp_result.total_age_decline.seconds = trycatchCalculate(tmp_result.total_age_decline.seconds, data[i].age_time_decline.seconds);
            }
        }
        return tmp_result;
    } catch (err) {
        console.log(err)
        return err;
    }
}

function trycatchCalculate(toReturn, toAdd) {
    try {
        toReturn += Math.abs(toAdd == null ? 0 : toAdd);
        return toReturn;
    } catch (err) {
        console.log(err)
        return toReturn;
    }
}

function getAverageTime(data, total) {
    try {
        let pending_1 = { months: 0, days: 0, hours: 0, minutes: 0 };
        let pending_2 = { months: 0, days: 0, hours: 0, minutes: 0 };
        let approve = { months: 0, days: 0, hours: 0, minutes: 0 };
        let decline = { months: 0, days: 0, hours: 0, minutes: 0 };

        pending_1.months = moment.duration(changeToSeconds(data.total_age_pending_1) / total, 'seconds').asMonths();
        pending_2.months = moment.duration(changeToSeconds(data.total_age_pending_2) / total, 'seconds').asMonths();
        approve.months = moment.duration(changeToSeconds(data.total_age_approve) / total, 'seconds').asMonths();
        decline.months = moment.duration(changeToSeconds(data.total_age_decline) / total, 'seconds').asMonths();

        pending_1.days = moment.duration(changeToSeconds(data.total_age_pending_1) / total, 'seconds').asDays();
        pending_2.days = moment.duration(changeToSeconds(data.total_age_pending_2) / total, 'seconds').asDays();
        approve.days = moment.duration(changeToSeconds(data.total_age_approve) / total, 'seconds').asDays();
        decline.days = moment.duration(changeToSeconds(data.total_age_decline) / total, 'seconds').asDays();

        pending_1.hours = moment.duration(changeToSeconds(data.total_age_pending_1) / total, 'seconds').asHours();
        pending_2.hours = moment.duration(changeToSeconds(data.total_age_pending_2) / total, 'seconds').asHours();
        approve.hours = moment.duration(changeToSeconds(data.total_age_approve) / total, 'seconds').asHours();
        decline.hours = moment.duration(changeToSeconds(data.total_age_decline) / total, 'seconds').asHours();

        pending_1.minutes = moment.duration(changeToSeconds(data.total_age_pending_1) / total, 'seconds').asMinutes();
        pending_2.minutes = moment.duration(changeToSeconds(data.total_age_pending_2) / total, 'seconds').asMinutes();
        approve.minutes = moment.duration(changeToSeconds(data.total_age_approve) / total, 'seconds').asMinutes();
        decline.minutes = moment.duration(changeToSeconds(data.total_age_decline) / total, 'seconds').asMinutes();

        return { pending_1, pending_2, approve, decline }
    } catch (err) {
        console.log(err);
        return err;
    }
}

function changeToSeconds(data) {
    return (data.months * 30 * 24 * 60 * 60) + (data.days * 24 * 60 * 60) + (data.hours * 60 * 60) + (data.minutes * 60) + data.seconds
}