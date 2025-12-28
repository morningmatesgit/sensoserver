const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/auth.model");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

// Google OAuth Client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ============================================================
   GOOGLE LOGIN (MOBILE/APP)
============================================================ */
exports.googleMobileLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ success: false, message: "ID Token is required" });
    }

    // Verify Google ID Token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if they don't exist
      user = await User.create({
        name,
        email,
        avatar: picture,
        googleId,
        authProvider: "google",
        // Password not required for Google users
      });
    } else {
      // Update existing user's Google info
      user.googleId = googleId;
      user.authProvider = "google";
      if (!user.avatar) user.avatar = picture;
      await user.save();
    }

    // Generate our JWT token
    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: "Google login successful",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid Google token",
    });
  }
};

/* ============================================================
   REGISTER USER (LOCAL AUTH)
============================================================ */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      authProvider: "local",
    });

    // Generate token
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

/* ============================================================
   LOGIN USER (LOCAL AUTH)
============================================================ */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user (include password)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Compare password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || null,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

/* ============================================================
   UPDATE PUSH TOKEN
============================================================ */
exports.updatePushToken = async (req, res) => {
  try {
    const { pushToken } = req.body;
    await User.findByIdAndUpdate(req.user.id, { pushToken });
    res.json({ success: true, message: "Push token updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ============================================================
   GET CURRENT USER
============================================================ */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ============================================================
   UPDATE PROFILE
============================================================ */
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select("-password");
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ============================================================
   FORGOT PASSWORD
============================================================ */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Always return success to prevent email enumeration
      return res.json({
        success: true,
        message: "If the email exists, reset link sent",
      });
    }

    // Create reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 1000 * 60 * 10; // 10 minutes
    await user.save();

    // Use the deep link scheme to open the app directly
    // Scheme defined in app.json is 'sensoplantcare'
    const resetUrl = `sensoplantcare://auth/resetpassword?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // HTML Email Template (no-reply design)
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2d5a3d;">Senso Plant Care</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p style="color: #555; font-size: 16px; line-height: 1.5;">
            Hello, ${user.name || 'Plant Lover'}. We received a request to reset your password. 
            Click the button below to set a new password in the app. This link is valid for 10 minutes.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #2d5a3d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
              Reset Password
            </a>
          </div>
          <p style="color: #888; font-size: 14px; text-align: center;">
            If the button doesn't work, ensure you have the Senso Plant Care app installed.
          </p>
          <p style="color: #888; font-size: 14px;">
            If you did not request this, please ignore this email. Your password will remain unchanged.
          </p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>This is an automated message, please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} Senso Plant Care. All rights reserved.</p>
        </div>
      </div>
    `;

    // Send email
    await sendEmail({
      to: email,
      subject: "Senso Plant Care — Password Reset Request",
      html,
    });

    return res.json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process password reset request",
    });
  }
};

/* ============================================================
   RESET PASSWORD
============================================================ */
exports.resetPassword = async (req, res) => {
  try {
    const email = req.body?.email;
    const resetToken = req.body?.resetToken;
    const newPassword = req.body?.newPassword;

    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, resetToken, and newPassword are required",
      });
    }

    const user = await User.findOne({
      email,
      resetToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    return res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("RESET ERROR >>>", error); 

    return res.status(500).json({
      success: false,
      message: "Server error during password reset",
      error: error.message,
    });
  }
};

/* ============================================================
   LOGOUT
============================================================ */
exports.logout = async (req, res) => {
  try {
    // For JWT based logout, client-side token deletion is usually enough.
    // Here we can clear refresh tokens if implemented or just return success.
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
