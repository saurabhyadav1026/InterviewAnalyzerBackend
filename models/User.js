import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    rollno: {
      type: String,
      required: true,
      unique: true,
   
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    branch: {
      type: String,
      required: true,
      trim: true,
    },
    year:{
      type:Number,
      enum:[1,2,3,4],
      required:true
    },

    passingYear: {
      type: Number,
     required:true
    },


    email: {
      type: String,
      required: true,
        lowercase: true,
    trim: true
   
    },


    password: {
      type: String,
      required: true,
      
    },
     role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    connectedPlatforms: {
      leetcode: {
        username: { type: String, default: "" },
        connectedAt: { type: Date, default: null },
        isLocked: { type: Boolean, default: false }
      },
      gfg: {
        username: { type: String, default: "" },
        connectedAt: { type: Date, default: null },
        isLocked: { type: Boolean, default: false }
      },
      codeforces: {
        username: { type: String, default: "" },
        connectedAt: { type: Date, default: null },
        isLocked: { type: Boolean, default: false }
      },
      hackerrank: {
        username: { type: String, default: "" },
        connectedAt: { type: Date, default: null },
        isLocked: { type: Boolean, default: false }
      },
      github: {
        username: { type: String, default: "" },
        connectedAt: { type: Date, default: null },
        isLocked: { type: Boolean, default: false }
      }
    },
    totalScore: {
      type: Number,
      default: 0
    },
    dayStreak: {
      type: Number,
      default: 0
    },
    lastActiveDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
  });

userSchema.pre("save", async function() {
    if (!this.isModified("password")) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
