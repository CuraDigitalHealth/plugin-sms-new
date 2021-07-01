import * as dotenv from 'dotenv';

export function LoadConfig(){
    dotenv.config();
    let path;
    switch(process.env.NODE_ENV){//add wanted environment files here. Will default to dev.
        case 'local':
            path = `${__dirname}/../../EnvironmentVariables/local/.env`;
            break;
        default:
            path = `${__dirname}/../../EnvironmentVariables/development/.env`;
    }
    dotenv.config({path: path });
}