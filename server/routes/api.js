import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth.js"; // Adjust the path based on your project
import { connectToDatabase } from "../db.js"; // Ensure your database connection is imported

const router = express.Router();

// Utility: Standardized error response
const sendErrorResponse = (res, status, message) => {
  console.error(`[ERROR] ${message}`);
  res.status(status).json({ error: message });
};

// ====== ROUTES ====== //

// Health Check Route
router.get("/", (req, res) => {
  res.json({ message: "API is working!" });
});

// ====== REGISTER ROUTE ======
router.post("/register", async (req, res) => {
  const { name, email, password, role, phoneNumber, schoolId } = req.body;

  console.log("[DEBUG] Incoming registration data:", req.body);

  if (!name || !email || !password || !role) {
    return sendErrorResponse(
      res,
      400,
      "Missing required fields: name, email, password, role"
    );
  }

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return sendErrorResponse(
      res,
      400,
      "Password must be at least 8 characters long, include one uppercase letter, one number, and one special character."
    );
  }

  try {
    const db = await connectToDatabase();
    console.log("[DEBUG] Connected to the database.");

    // Check if the email is already registered
    const [existingUser] = await db.query(
      "SELECT * FROM Users WHERE Email = ?;",
      [email]
    );
    if (existingUser.length > 0) {
      return sendErrorResponse(res, 400, "Email is already registered");
    }

    // Hash the password and insert the new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO Users (Name, Email, Password, Role, PhoneNumber, SchoolID) VALUES (?, ?, ?, ?, ?, ?);",
      [name, email, hashedPassword, role, phoneNumber || null, schoolId || null]
    );

    console.log("[DEBUG] User successfully registered:", result.insertId);

    // Generate JWT Token
    const token = jwt.sign(
      { id: result.insertId, role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
      token,
    });
  } catch (error) {
    sendErrorResponse(res, 500, "Server error during registration");
  }
});

// =========== group route=======
router.post("/groups", verifyToken, async (req, res) => {
  const { classId, groupName, students } = req.body;

  if (req.user.role !== "Student") {
    return res.status(403).json({ error: "Only students can create groups." });
  }

  if (!classId || !groupName || !students || students.length !== 5) {
    return res.status(400).json({
      error: "Class ID, group name, and exactly 5 students are required.",
    });
  }

  try {
    const db = await connectToDatabase();

    // Insert group into Groups table
    const [groupResult] = await db.query(
      "INSERT INTO Groups (ClassID, GroupName) VALUES (?, ?);",
      [classId, groupName]
    );

    const groupId = groupResult.insertId;

    // Add students to the group
    const studentInserts = students.map((studentId) =>
      db.query(
        "INSERT INTO StudentGroups (GroupID, StudentID) VALUES (?, ?);",
        [groupId, studentId]
      )
    );

    await Promise.all(studentInserts);

    res.status(201).json({
      message: "Group created successfully.",
      groupId,
    });
  } catch (error) {
    console.error("[ERROR] Creating group failed:", error.message || error);
    res.status(500).json({ error: "Server error creating group." });
  }
});

// ====== LOGIN ROUTE ======
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  console.log("[DEBUG] Incoming login data:", req.body);

  if (!username || !password) {
    return sendErrorResponse(res, 400, "Username and password are required");
  }

  try {
    const db = await connectToDatabase();
    console.log("[DEBUG] Connected to the database.");

    const [userResult] = await db.query("SELECT * FROM Users WHERE Name = ?;", [
      username,
    ]);
    if (userResult.length === 0) {
      return sendErrorResponse(res, 401, "Invalid username or password");
    }

    const user = userResult[0];

    const isPasswordValid = await bcrypt.compare(password, user.Password);
    if (!isPasswordValid) {
      return sendErrorResponse(res, 401, "Invalid username or password");
    }

    const token = jwt.sign(
      { id: user.UserID, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      userId: user.UserID,
      role: user.Role,
      token,
    });
  } catch (error) {
    sendErrorResponse(res, 500, "Server error during login");
  }
});

// ====== PROFILE ROUTE ======
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    console.log("[DEBUG] Fetching profile for user ID:", req.user.id);

    const [userResult] = await db.query(
      "SELECT * FROM Users WHERE UserID = ?;",
      [req.user.id]
    );
    if (userResult.length === 0) {
      return sendErrorResponse(res, 404, "User not found");
    }

    const user = userResult[0];
    res.status(200).json({
      id: user.UserID,
      name: user.Name,
      email: user.Email,
      role: user.Role,
      phoneNumber: user.PhoneNumber,
    });
  } catch (error) {
    sendErrorResponse(res, 500, "Server error fetching user profile");
  }
});

// ====== HANDLE INVALID ROUTES ======
router.use((req, res) => {
  sendErrorResponse(res, 404, "Endpoint not found");
});

export default router;
