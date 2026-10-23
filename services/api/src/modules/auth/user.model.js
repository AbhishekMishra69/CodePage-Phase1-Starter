import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const ROLES = Object.freeze({
  USER: "USER",
  ADMIN: "ADMIN",
});

const userSchema = new mongoose.Schema(
  {
    /* =========================================
       BASIC USER INFORMATION
    ========================================= */

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-z0-9_]+$/,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
      immutable: true,
    },

    /* =========================================
       PROFILE
    ========================================= */

    avatar: {
      type: String,
      default: "",
      trim: true,
    },

    bio: {
      type: String,
      default: "",
      maxlength: 500,
      trim: true,
    },

    location: {
      type: String,
      default: "",
      maxlength: 100,
      trim: true,
    },

    website: {
      type: String,
      default: "",
      maxlength: 200,
      trim: true,
    },

    github: {
      type: String,
      default: "",
      maxlength: 100,
      trim: true,
    },

    linkedin: {
      type: String,
      default: "",
      maxlength: 200,
      trim: true,
    },

    /* =========================================
       PROBLEM STATISTICS
    ========================================= */

    solvedProblems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
      },
    ],

    attemptedProblems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
      },
    ],

    /* =========================================
       SOCIAL
    ========================================= */

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    /* =========================================
       CODING STATISTICS
    ========================================= */

    totalSubmissions: {
      type: Number,
      default: 0,
      min: 0,
    },

    acceptedSubmissions: {
      type: Number,
      default: 0,
      min: 0,
    },

    contestParticipations: {
      type: Number,
      default: 0,
      min: 0,
    },

    contestRating: {
      type: Number,
      default: 1200,
      min: 0,
    },

    /* =========================================
       GAMIFICATION
    ========================================= */

    points: {
      type: Number,
      default: 0,
      min: 0,
    },

    badges: [
      {
        type: String,
      },
    ],

    certifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Certification",
      },
    ],
  },
  {
    timestamps: true,
  }
);

/* =========================================
   PASSWORD HASHING
========================================= */

userSchema.pre("save", async function hashPassword() {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

/* =========================================
   PASSWORD COMPARISON
========================================= */

userSchema.methods.comparePassword = function comparePassword(
  candidate
) {
  return bcrypt.compare(candidate, this.password);
};

/* =========================================
   VIRTUALS
========================================= */

userSchema.virtual("followersCount").get(function () {
  return this.followers?.length || 0;
});

userSchema.virtual("followingCount").get(function () {
  return this.following?.length || 0;
});

userSchema.set("toJSON", {
  virtuals: true,
});

userSchema.set("toObject", {
  virtuals: true,
});

/* =========================================
   MODEL
========================================= */

export const User = mongoose.model("User", userSchema);