import express = require('express');
import { PORT } from '../config/constants';
import { router } from '../services/routes/router';

const app = express();

app.use(express.json());

// setup api router
app.use(router);

app.listen( PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})