import {Request, Response, NextFunction} from 'express';
import { ExampleController as ExampleController } from '../controllers/ExampleController';
import { SecretKeyController } from '../controllers/secretKeyController';
import * as crypto from 'crypto';

import * as logger from '../utils/logger';

let accessDeniedMsg: String = 'You have not been given permission to access this content. If you feel this is a mistake please contact an administrator.';

export class Routes {    
    
    public exampleController: ExampleController = new ExampleController();
    public secretKeyController: SecretKeyController = new SecretKeyController();

    public accessDeniedMsg: String = 'You have not been given permission to access this content. If you feel this is a mistake please contact an administrator.';

    public routes(app): void {   
        app.use(this.CheckCId);

        app.route('/')
            .post(this.CheckWriteSecret, this.CheckCId, this.exampleController.Create)
            .get(this.CheckReadSecret, this.exampleController.GetAll);

        app.route('/admin/secretkey/')
            .get(this.CheckAdminSecret, this.secretKeyController.GetAll)
            .post(this.CheckAdminSecret, this.secretKeyController.Create);

        app.route('/admin/secretkey/search/:secret')
            .get(this.CheckAdminSecret, this.secretKeyController.GetSecretKeyByKey);

        app.route('/admin/secretkey/:secretKeyId')
            .get(this.CheckAdminSecret, this.secretKeyController.GetSecretKeyWithID)
            .delete(this.CheckAdminSecret, this.secretKeyController.DeleteSecretKey);
    }

    public CheckCId(req: Request, res: Response, next: NextFunction){
        if(!req.header('correlationId')){
            let cId = crypto.randomBytes(20).toString('hex');
            res.setHeader('correlationId', cId); 
        }else{
            res.setHeader('correlationId', req.header('correlationId'));
        }
        next()
    }

    public CheckReadSecret(req: Request, res: Response, next: NextFunction){
        this.secretKeyController.GetSecretKey(req.header('secret'), function(err, secret){
            if(err){
                logger.logError(res.getHeader('correlationId'), err);
                res.status(500).send(err);
            }else{
                if(secret.accessLevel != 'admin' || secret.accessLevel != 'r' || secret.accessLevel != 'rw'){
                    res.status(401).send(this.accessDeniedMsg);
                    logger.logError(res.getHeader('correlationId'), accessDeniedMsg + " Ip: " + req.ip);
                }else{
                    next();
                }
            }
        });
    }

    public CheckWriteSecret(req: Request, res: Response, next: NextFunction){
        this.secretKeyController.GetSecretKey(req.header('secret'), function(err, secret){
            if(err){
                logger.logError(req.header('correlationId'), err);
                res.status(500).send(err);
            }else{
                if(secret.accessLevel != 'admin' || secret.accessLevel != 'w' || secret.accessLevel != 'rw'){
                    res.status(401).send(this.accessDeniedMsg);
                    logger.logError(res.getHeader('correlationId'), accessDeniedMsg + " Ip: " + req.ip);
                }else{
                    next();
                }
            }
        });
    }

    public CheckAdminSecret(req: Request, res: Response, next: NextFunction){
        let tempSecretKeyController: SecretKeyController = new SecretKeyController();
        tempSecretKeyController.GetSecretKey(req.header('secret'), function(err, secret){
            if(err){
                logger.logError(res.getHeader('correlationId'), err);
                res.status(500).send(err);
            }else{
                if(!secret || secret.accessLevel != 'admin'){
                    res.status(401).send(accessDeniedMsg);
                    logger.logError(res.getHeader('correlationId'), accessDeniedMsg + " Ip: " + req.ip);
                }else{
                    next();
                }
            }
        });
    }
}