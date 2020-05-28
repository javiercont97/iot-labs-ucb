import express = require('express');
import { PORT, appLogger } from '../config/constants';
import { router } from '../services/routes/router';

const app = express();

app.use(express.json());

// setup api router
app.use(router);

app.listen( PORT, () => {
    appLogger.debug('Server Status', '1', `Server listening on PORT ${PORT}`);
});