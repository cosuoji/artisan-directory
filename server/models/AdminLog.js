import mongoose from "mongoose";

const { Schema, model } = mongoose;

const AdminLogSchema = new Schema(
  {
    adminId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    adminName: { type: String, required: true },
    action: { type: String, required: true }, // e.g., "BANNED_USER", "GRANTED_PRO"
    targetUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetUserEmail: { type: String, required: true },
    details: { type: String }, // Extra context if needed
  },
  { timestamps: true }, // Automatically creates 'createdAt' (immutable timeline)
);

export default model("AdminLog", AdminLogSchema);
