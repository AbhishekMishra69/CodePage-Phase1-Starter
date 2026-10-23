import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { User, ROLES } from "./user.model.js";

/* =========================================
   PUBLIC USER
========================================= */

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,

    avatar: user.avatar || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
    github: user.github || "",
    linkedin: user.linkedin || "",

    followersCount: user.followers?.length || 0,
    followingCount: user.following?.length || 0,

    solvedProblemsCount:
      user.solvedProblems?.length || 0,

    totalSubmissions:
      user.totalSubmissions || 0,

    acceptedSubmissions:
      user.acceptedSubmissions || 0,

    contestParticipations:
      user.contestParticipations || 0,

    contestRating:
      user.contestRating || 1200,

    points:
      user.points || 0,

    badges:
      user.badges || [],

    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/* =========================================
   JWT
========================================= */

function tokenFor(user) {
  return jwt.sign(
    {
      role: user.role,
    },
    env.jwtSecret,
    {
      subject: user.id,
      expiresIn: env.jwtExpiresIn,
    }
  );
}

/* =========================================
   REGISTER
========================================= */

export async function register(req, res, next) {
  try {
    const {
      name,
      username,
      email,
      password,
    } = req.body;

    /* =========================================
       REQUIRED FIELDS
    ========================================= */

    if (
      !name ||
      !username ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        message:
          "Name, username, email, and password are required.",
      });
    }

    /* =========================================
       NORMALIZE
    ========================================= */

    const normalizedUsername = username
      .trim()
      .toLowerCase();

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    /* =========================================
       USERNAME VALIDATION
    ========================================= */

    if (
      normalizedUsername.length < 3 ||
      normalizedUsername.length > 30
    ) {
      return res.status(400).json({
        message:
          "Username must be between 3 and 30 characters.",
      });
    }

    if (
      !/^[a-z0-9_]+$/.test(normalizedUsername)
    ) {
      return res.status(400).json({
        message:
          "Username can contain only lowercase letters, numbers, and underscores.",
      });
    }

    /* =========================================
       PASSWORD VALIDATION
    ========================================= */

    if (password.length < 8) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long.",
      });
    }

    /* =========================================
       CHECK EMAIL
    ========================================= */

    if (
      await User.exists({
        email: normalizedEmail,
      })
    ) {
      return res.status(409).json({
        message:
          "An account with this email already exists.",
      });
    }

    /* =========================================
       CHECK USERNAME
    ========================================= */

    if (
      await User.exists({
        username: normalizedUsername,
      })
    ) {
      return res.status(409).json({
        message:
          "This username is already taken.",
      });
    }

    /* =========================================
       CREATE USER
    ========================================= */

    const user = await User.create({
      name: name.trim(),
      username: normalizedUsername,
      email: normalizedEmail,
      password,
      role: ROLES.USER,
    });

    /* =========================================
       RESPONSE
    ========================================= */

    res.status(201).json({
      token: tokenFor(user),
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
}

/* =========================================
   LOGIN
========================================= */

export async function login(req, res, next) {
  try {
    const {
      email,
      password,
    } = req.body;

    const normalizedEmail = email
      ?.trim()
      .toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (
      !user ||
      !(await user.comparePassword(password || ""))
    ) {
      return res.status(401).json({
        message:
          "Invalid email or password.",
      });
    }

    res.json({
      token: tokenFor(user),
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
}

/* =========================================
   CURRENT USER
========================================= */

export function me(req, res) {
  res.json({
    user: publicUser(req.user),
  });
}

/* =========================================
   UPDATE PROFILE
========================================= */

export async function updateProfile(req, res, next) {
  try {
    const allowedFields = [
      "name",
      "username",
      "bio",
      "location",
      "website",
      "github",
      "linkedin",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] =
          typeof req.body[field] === "string"
            ? req.body[field].trim()
            : req.body[field];
      }
    }

    if (updates.name !== undefined) {
      if (!updates.name || updates.name.length > 80) {
        return res.status(400).json({
          message: "Name is required and must not exceed 80 characters.",
        });
      }
    }

    if (updates.username !== undefined) {
      updates.username = updates.username.toLowerCase();

      if (
        updates.username.length < 3 ||
        updates.username.length > 30 ||
        !/^[a-z0-9_]+$/.test(updates.username)
      ) {
        return res.status(400).json({
          message: "Username must be 3–30 characters and contain only lowercase letters, numbers, and underscores.",
        });
      }

      const existingUser = await User.findOne({
        username: updates.username,
        _id: { $ne: req.user._id },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "This username is already taken.",
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json({
      message: "Profile updated successfully.",
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
}
