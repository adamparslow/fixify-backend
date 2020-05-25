const schedule = require('node-schedule');

const megamixSchedule = "0 3 * * *";
// const megamixSchedule = "* * * * * *";

exports.scheduleMegamixes = (scheduledJob) => {
    schedule.scheduleJob(megamixSchedule, () => {
        scheduledJob();
    });
};