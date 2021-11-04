import schedule from "node-schedule";

import megamixCreator from "./megamixCreator.mjs";

const megamixSchedule = "0 19 * * *";
// const megamixSchedule = "* * * * *";

export default {
	scheduleMegamixes: () => {
		schedule.scheduleJob(megamixSchedule, async () => {
			console.log("Running schedule");
			await megamixCreator.generateMegamixes();
		});
	},
};
