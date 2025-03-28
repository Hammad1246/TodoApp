import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema(
  {
    description: { type: String },
    completed: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Todo = mongoose.model("Todo", todoSchema);
