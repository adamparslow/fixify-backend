const express = require('express');
const router = express.Router();

const megamixStorage = require('../serverScripts/megamixStorage');

router.post('/save_megamix', (req, res) => {
    const refreshToken = req.body.refresh_token;
    const userId = req.body.user_id;

    if (!refreshToken || !userId) {
        res.sendStatus(400);
    }

    megamixStorage.saveMegamix(refreshToken, userId);

    res.send(refreshToken);
});

router.post('/get_megamixes', (req, res) => {
    megamixStorage.getMegamixes();

    res.sendStatus(200);
})

module.exports = router;