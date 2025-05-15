import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

// Create a compound index to ensure a user can only bookmark a job once
bookmarkSchema.index({ user: 1, job: 1 }, { unique: true });

export const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
