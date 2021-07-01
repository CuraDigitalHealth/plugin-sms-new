import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';

import { Routes } from './routes/routes';
import * as config from './utils/config';
import * as logger from './utils/logger';

config.LoadConfig();

class App {

    public app: express.Application;
    public routes: Routes = new Routes();

    constructor() {
        this.app = express();
        this.config();
        this.routes.routes(this.app);
        this.mongoSetup();
    }

    private mongoSetup(): void{
        mongoose.Promise = global.Promise;
        mongoose.connect(process.env.DBCONNECTIONSTRING, { useNewUrlParser: true }).then(
            () => {
                logger.logEvent(null, 'Successfully connected to Mongo');
            },
            (err) => {
                logger.logEvent(null, 'Failed Mongo Connection');
                process.exit();
            }
        )
    }

    private config(): void{
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

}

export default new App().app;