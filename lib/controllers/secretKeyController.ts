import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import * as crypto from 'crypto';

import { secretKeySchema } from '../models/secretKeyModel';
import * as logger from '../utils/logger';

const SecretKey = mongoose.model('SecretKey', secretKeySchema);

export class SecretKeyController{
    public Create(req: Request, res: Response) {
        let accessLevel = req.body.accessLevel;
        let errMsg;
        if(!accessLevel){
            errMsg = 'Access Level must be given.';
        }else if(accessLevel != 'r' && accessLevel != 'w' && accessLevel != 'rw' && accessLevel != 'admin'){
            errMsg = 'Access level invalid. Must be \'r\', \'w\', \'rw\', or \'admin\'';
        }
        if(errMsg){
            console.log(errMsg);
            logger.logError(res.getHeader('correlationId'), errMsg);
            res.status(400).send(errMsg);
            return;
        }

        let newSecretKey = new SecretKey(req.body);
        newSecretKey.key = crypto.randomBytes(20).toString('hex');

        
        newSecretKey.save((err, secretKey) => {
            if(err){
                logger.logError(res.getHeader('correlationId'), err);
                res.status(500).send(err);
                return;
            }
            let msg = 'Secret Key issued to ' + secretKey.issuedTo;
            console.log(msg);
            logger.logEvent(res.getHeader('correlationId'), msg);
            res.json(secretKey);
        });
    }

    public GetAll (req: Request, res: Response) {           
        SecretKey.find({}, (err, secretKeys) => {
            if(err){
                logger.logError(res.getHeader('correlationId'), err);
                res.send(err);
                return;
            }
            logger.logEvent(res.getHeader('correlationId'), 'Secret Keys viewed by ' + req.ip);
            res.json(secretKeys);
        });
    }

    public GetSecretKeyWithID (req: Request, res: Response) {           
        SecretKey.findById(req.params.secretKeyId, (err, secretKey) => {
            if(err){
                logger.logError(res.header('correlationId'), err);
                res.send(err);
            }
            logger.logEvent(res.getHeader('correlationId'), 'Secret Key ' + secretKey._id +' viewed by ' + req.ip);
            res.json(secretKey);
        });
    }

    public GetSecretKeyByKey (req: Request, res: Response) {
        SecretKey.find({key: req.params.secret}, function (err, secret) {
            if(err){
                logger.logError(res.getHeader('correlationId'), err);
                res.status(500).send(err);
                return;
            }
            logger.logEvent(res.getHeader('correlationId'), 'Secret Key ' + secret._id +' viewed by ' + req.ip);
            res.json(secret);
        });
    }

    public GetSecretKey(key, callBack){
        SecretKey.findOne({ key: key }, callBack);
    }

    public DeleteSecretKey(req: Request, res: Response){          
        SecretKey.remove({ _id: req.params.secretKeyId }, (err, secret) => {
            if(err){
                logger.logError(res.getHeader('correlationId'), err);
                res.status(500).send(err);
                return;
            }
            logger.logEvent(res.getHeader('correlationId'), 'Secret Key deleted by ' + req.ip);
            res.json({ message: 'Successfully deleted secret key.'});
        });
    }
}