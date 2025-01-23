const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authentication token missing" });
  }

  try {
    //Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //Attach the decoded user info to the request
    req.user = decoded;
    next();
  } catch (error) {
    res
      .status(403)
      .json({ message: "Access Denied: You do not have permission" });
  }
};

module.exports = { authenticateToken };
