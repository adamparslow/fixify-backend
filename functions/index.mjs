import functions from 'firebase-functions';
import express from 'express';

const app2 = express();
const port = 3000;

app2.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});

app2.get("/ping", (req, res) => {
    console.log(functions.config());
    res.send('HI');
});

export const app = functions.https.onRequest(app2);
