// Get User Profile
const getUserProfile = (req, res) => {
    res.send(req.user); // req.user is populated by the auth middleware
  };
  
  // Update User Profile
  const updateUserProfile = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'mobile', 'address'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  
    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
    }
  
    try {
      updates.forEach((update) => (req.user[update] = req.body[update]));
      await req.user.save();
      res.send(req.user);
    } catch (error) {
      res.status(400).send(error);
    }
  };
  
  module.exports = { getUserProfile, updateUserProfile };
  