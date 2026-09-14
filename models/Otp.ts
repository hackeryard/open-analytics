import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ["login", "password_reset"],
      default: "login",
      index: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index: documents are automatically deleted when expiresAt <= current date
    },
  },
  {
    timestamps: true,
  }
);

OtpSchema.index({ email: 1, purpose: 1 });

export default mongoose.models.Otp || mongoose.model("Otp", OtpSchema);
