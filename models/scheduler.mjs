import schedule from 'node-schedule';

import megamixCreator from './megamixCreator.mjs';

const megamixSchedule = "0 3 * * *";
// const megamixSchedule = "* * * * * *";

export default {
    scheduleMegamixes: () => {
        schedule.scheduleJob(megamixSchedule, () => {
            megamixCreator.generateMegamixes();
        });
    }
}