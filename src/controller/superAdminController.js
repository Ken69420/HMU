const User = require("../models/userModel");
const bcrypt = require("bcrypt");

//Create a new user
const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    //validate input
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      email_verified: true,
    });

    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error) {
    console.error("Error in createUser: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Read all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "role", "email_verified"],
    });

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error in getAllUsers: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Update User details
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, role, password } = req.body;

    //Find by id
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    //Update user fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;
    if (role) user.role = role;

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error in updateUser: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Remove a user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    //find by id
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    await user.destroy();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createUser, getAllUsers, updateUser, deleteUser };
