import express from 'express';

import megamixStorage from '../models/megamixStorage.mjs';
import megamixCreator from '../models/megamixCreator.mjs';

const router = express.Router();

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
    megamixCreator.generateMegamixes();

    res.sendStatus(200);
});

router.post("/clear", (req, res) => {
    megamixStorage.clearMegamixes();

    res.sendStatus(200);
})


export default router;