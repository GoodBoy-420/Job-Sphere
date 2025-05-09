import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    // role: {
    //   type: String,
    //   required: true,
    // },
 
  },
  { timestamps: true ,versionKey: false}
);
export const Admin = mongoose.model("Admin", adminSchema);
