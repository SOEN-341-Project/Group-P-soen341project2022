import express, { Response, Request } from 'express';
import { format } from 'util';
import bcrypt from 'bcrypt';
import hasRequiredUserCreationParams from '../helpers/verifyUserCreation';
import { User, UserRole } from '@prisma/client';
import { createUser, allUsers, userByEmail, updateUser, allSellers, deactivateUser } from '../prismaFunctions/userFuncs';
import { signToken, objectFromRequest } from '../helpers/jwtFuncs';

const userRouter = express.Router();

userRouter.post('/register', async (req: Request, res: Response) => {
  try {
    // verify that necessary parameters are there
    const role = ((req.body.role as string).toUpperCase()) as UserRole;
    if (
      !hasRequiredUserCreationParams({
        email: req.body.email,
        password: req.body.password,
        address1: req.body.address1,
        role: role,
      })
    ) {
      throw (new Error().message = format('Data missing'));
    }if(role === UserRole.SELLER && (req.body.sellerName === null || req.body.sellerName === undefined)){
      throw (new Error().message = format('Seller name is missing'));
    }
    const encryptedPassword = await bcrypt.hash(req.body.password, 5); //encrypt password
    const newUser = await createUser({
      email: req.body.email,
      pWord: encryptedPassword,
      role: role,
      uName: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      address1: req.body.address1,
      sellerName: req.body.sellerName,
    });
    const userToken = signToken(newUser);
    res.status(200).json({ user: newUser, token: userToken });
  } catch (e) {
    res.status(400).json({ error: e, message: e.meta?.cause || e.message });
  }
});

userRouter.post('/signin', async (req: Request, res: Response) => { // check if email and password are existing values and are correct
  // check if email is attatched to a user
  try{
    const usr = await userByEmail({ email: req.body.email });
    if (usr === null) {
      throw new Error('User not found');
    }
    if (!usr?.active) {
      throw new Error('User has been deleted');
    }
    const match = await bcrypt.compare(req.body.password, usr.password);
    if (match) {
      // password is correct
      const userToken = signToken(usr);
      res.status(200).json({ token: userToken, user: usr });
    } else {
      throw new Error('Password is incorrect');
    }
  } catch (e) {
    res.status(400).json({ error: e, message: e.meta?.cause || e.message });
  }
  // user does exist, check if password is correct
});

userRouter.post('/update', async (req: Request, res: Response) => { // updates an existing user
  const usr = objectFromRequest(req) as User;
  try {
    if (usr === null || usr === undefined) {
      throw new Error('Authentication is invalid');
    }
    const match = await bcrypt.compare(req.body.oldPassword, usr.password);
    if (!match){
      throw new Error('Password is incorrect');
    }
    let encryptedPassword: string | undefined;
    if (req.body.password !== undefined) {
      //new password
      encryptedPassword = await bcrypt.hash(req.body.password, 5);
    }
    const newUsr = await updateUser({
      userId: usr.id,
      email: req.body.email || usr.email,
      pWord: encryptedPassword || usr.password,
      role: usr.role,
      uName: req.body.username || usr.username,
      firstName: req.body.firstName || usr.firstName,
      lastName: req.body.lastName || usr.lastName,
      address1: req.body.address1 || usr.address1,
      sellerName: req.body.sellerName || usr.sellerName,
    });
    const newToken = signToken(newUsr);
    res.status(200).json({ user: newUsr, token: newToken });
  } catch (e) {
    if (e.code === 'P2002') {
      e.message = 'Unique constraint on ' + e.meta.target + ' failed';
    }
    console.log(e);
    res.status(400).json({ error: e, message: e.message });
  }
});

userRouter.delete('/delete', async (req: Request, res: Response) => {
  const auth = objectFromRequest(req) as User;
  try {
    if (auth == undefined || auth == null) {
      throw new Error('Invalid authentication');
    }
    let userId = auth.id;
    if(auth.role === UserRole.ADMIN) {
      userId = parseInt(req.query['id'] as string);
    }
    //Admin can delete any account but others only their own
    const deactivatedUser = await deactivateUser({id : isNaN(userId) ? auth.id : userId}); 
    res.status(200).json(deactivatedUser); 
  } catch (e) {
    res.status(400).json({ error: e, message: e.message });
  }
});

userRouter.get('/sellers', async (req: Request, res: Response) => { // finds all sellers
  await allSellers()
    .then((sellers) => {
      res.status(200).json(sellers);
    })
    .catch((e) => {
      res.status(500).json({ error: e, message: e.message });
    });
});

userRouter.get('/all', async (req: Request, res: Response) => {
  const auth = objectFromRequest(req);
  try {
    if (auth == undefined || auth == null) {
      throw new Error('Invalid authentication');
    }
    await allUsers()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ error: e, message: e.message });
    });
  } catch (e) {
    res.status(400).json({ error: e, message: e.message });
  }
});

export default userRouter;
