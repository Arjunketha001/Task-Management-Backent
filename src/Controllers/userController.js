import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../Schema/user.js';
import { JWT_SECRET } from '../Config/serverConfig.js';

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  const user = await User.create({ username, email, password });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

  return res.status(201).json({ user, token });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    console.log("user login", user.username);
    
  return res.status(200).json({ user, token });
};
