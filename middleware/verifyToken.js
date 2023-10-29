import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};
