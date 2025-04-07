import User from '../models/User.js';
export const getTelecallers = async (req, res) => {
  const telecallers = await User.find({ role: 'telecaller' }).select('-password');
  res.json(telecallers);
};