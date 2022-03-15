import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { User } from '@prisma/client';

export function signToken(object: any) {
  return jwt.sign(object, process.env.JWT_SECRET as string, { expiresIn: '24h' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET as string, (err, data) => {
    if (err) return null;
    return data;
  });
}

export function objectFromRequest(req: Request): unknown {
  const token = req.headers.authorization
  if (token) return verifyToken((token as string).split(' ')[1]);
  return undefined;
}
