const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const init = require('./serverScripts/init');

const generalRoutes = require('./routes/general');
const authRoutes = require('./routes/spotifyOauth');
const megamixRoutes = require('./routes/megamix');

const app = express();
const port = process.env.PORT || 8080;

init();

app.use(express.static('client/build'))
    .use(express.json())
    .use(cors())
    .use(cookieParser())
    .use('/auth', authRoutes)
    .use('/megamix', megamixRoutes)
    .use('/', generalRoutes);

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})