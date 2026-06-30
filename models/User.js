import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    rollNo: {
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

    passingYear: {
      type: Number,
      required: true,
    },


    email: {
      type: String,
      required: true,
   
    },


    password: {
      type: String,
      required: true,
      minlength: 6,
    },
     role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
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
