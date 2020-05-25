const scheduler = require('./scheduler');
const megamixStorage = require('./megamixStorage');

module.exports = () => {
    megamixStorage.init(); 
    scheduler.scheduleMegamixes(() => { console.log("This works"); });
};