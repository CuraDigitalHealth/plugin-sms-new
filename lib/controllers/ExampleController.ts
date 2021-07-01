import * as mongoose from 'mongoose';
import { Request, Response } from 'express';

import { exampleSchema } from '../models/exampleModel';
import * as logger from '../utils/logger';

const Example = mongoose.model('Example', exampleSchema);

export class ExampleController{
    public Create(req: Request, res: Response) {
        let newExample = new Example(req.body);
        newExample.correlationId = res.getHeader('correlationId');

        newExample.save((err, example) => {
            if(err){
                logger.logError(res.getHeader('correlationId'), err);
                res.status(500).send(err);
                return;
            }
            res.json(example);
        });
    }

    public GetAll (req: Request, res: Response) {           
        Example.find({}, (err, examples) => {
            if(err){
                logger.logError(res.getHeader('correlationId'), err);
                res.status(500).send(err);
                return;
            }
            res.json(examples);
        });
    }
}