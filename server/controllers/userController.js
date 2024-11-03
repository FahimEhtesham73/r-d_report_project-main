import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: "User not found" });
  }
};

// Delete a user (admin only, cannot delete themselves)
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  // Use findByIdAndDelete to delete the user directly
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({ message: 'User deleted successfully' });
}

export const changeUserRole = async (req, res) => {
  const { id } = req.params;
  const { userType } = req.body;  // Changed from userType to newRole
  console.log("body", req.body);

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.userType = userType; // Changed userType to newRole
  console.log({ user });
  await user.save();
  res.json({ message: 'User role updated successfully', user });
};


export const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};