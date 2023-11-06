import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';

export const register = async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      throw new BadRequestError('User already exists');
    }
    const user = await User.create({ ...req.body });
    res.status(StatusCodes.OK).json({ msg: 'User Created Successfully', user });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Invalid Credentials' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new BadRequestError('Please provide email and password');
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError('Invalid Credentials');
    }

    //password comparison
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError('Invalid Credentials');
    }

    const token = user.createJWT();
    res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });
    res.status(StatusCodes.OK).json({ user: { name: user.full_name }, token });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error });
  }
};
