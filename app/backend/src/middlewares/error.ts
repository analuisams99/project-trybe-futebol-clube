import { NextFunction, Request, Response } from 'express';
import { Error } from 'sequelize/types';

const error = (err: Error, req: Request, res: Response, _next: NextFunction) : void => {
  res.status(500).json({ message: err.message });
};

export default error;
