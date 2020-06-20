import express = require('express');
import { PORT, appLogger } from '../config/constants';
import { router } from './routes/router';

import {resolve as resolvePath} from 'path';
import WSTelemtryServer from '../services/wstt/wsts';

appLogger.verbose('Server status', 'Waking up server');

const app = express();
app.use(express.json());

appLogger.verbose('Server status', 'JSON parser has been set up');

app.use(express.static(resolvePath(__dirname, '../../public')));

appLogger.verbose('Server status', 'Public folder path has been set up');

// setup api router
app.use('/api', router);

appLogger.verbose('Server status', 'API router has been set up');

// allow react app handle everything else
app.get('*', (req ,res) =>{
    res.sendFile(resolvePath(__dirname, '../../public/index.html'));
});

app.listen( PORT, () => {
    appLogger.info('Server status', `Server listening on PORT ${PORT}`);
});


// let wstt = new WSTelemtryServer();