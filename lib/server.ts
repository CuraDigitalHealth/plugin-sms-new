import app from './app';
import * as https from 'https';
import * as fs from 'fs';

import * as logger from './utils/logger';

let PORT = process.env.PORT || 5001;
let msg = 'Express server listening on port ' + PORT;
let origin = './EnvironmentVariables/';

const httpsOptions = {
    key: fs.readFileSync(origin + process.env.KEY),
    cert: fs.readFileSync(origin + process.env.CERT)
}

https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(msg);
    logger.logEvent(null, msg);
})