import mongoose from "mongoose";

const clientSchema = mongoose.Schema({
  fullName: { type: String, required: false },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  phoneNumber: { type: String, required: false },
});

export const Client = mongoose.model("reactClient", clientSchema);
