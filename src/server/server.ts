import { PORT, appLogger } from '../config/constants';
import express = require('express');
import { json as jsonParser, urlencoded as urlParser} from 'body-parser';
import fileUploader = require('express-fileupload');

import compression = require('compression');

import { router } from './routes/router';
import WSTelemtryServer from '../services/wstt/wsts';

import {resolve as resolvePath} from 'path';
import { createServer as HTTPCreateServer } from 'http';

appLogger.verbose('Server', 'Waking up server');

const app = express();

app.use(jsonParser());
appLogger.verbose('Server', 'JSON parser has been set up');

app.use(urlParser({ extended: false }));
appLogger.verbose('Server', 'URL-encoded parser has been set up');

app.use(fileUploader());
appLogger.verbose('Server', 'File parser has been set up');

app.use(compression());
appLogger.verbose('Server', 'Compression middleware has been set up');

app.use(express.static(resolvePath(__dirname, '../../public')));

appLogger.verbose('Server', 'Public folder path has been set up');

// setup api router
app.use('/api', router);

appLogger.verbose('Server', 'API router has been set up');

// allow react app handle everything else
app.get('*', (req ,res) =>{
    res.sendFile(resolvePath(__dirname, '../../public/index.html'));
});

let server = HTTPCreateServer(app);

let wstt = new WSTelemtryServer({server});
wstt.setupWSTT_Server();

server.listen( PORT, () => {
    appLogger.info('Server', `Server listening on PORT ${PORT}`);
});
