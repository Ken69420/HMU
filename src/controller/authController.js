const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { sendVerificationEmail } = require("../utils/email");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const RegisterUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //Check if the user already exist
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Generate a unique verification token
    const verificationToken = uuidv4();

    //Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      verificationToken,
      email_verified: false,
    });

    //Send verification email
    const verificationLink = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/verify-email/${verificationToken}`;
    await sendVerificationEmail(email, verificationLink);

    res.status(201).json({
      message: "User created successfully. Please verify your email to login",
    });
  } catch (error) {
    console.error("Error in RegisterUser: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) {
      return res.status(400).json({ message: "invalid token" });
    }

    user.email_verified = true;
    user.verificationToken = null; //clear the token
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    //validate input
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //Check if the user exists
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //Check if email is verified
    if (!user.email_verified) {
      return res
        .status(400)
        .json({ message: "Please verify your email to login" });
    }

    //check if password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    //Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, verified: user.email_verified },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    //Refresh token
    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
      })
      .json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error in loginUser: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    //Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    //Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    //Generate new access token
    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role, verified: user.email_verified },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error in refreshAccessToken:", error);
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

module.exports = { RegisterUser, verifyEmail, loginUser, refreshAccessToken };
