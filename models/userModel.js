import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    phone_number: { type: String },
    email: { type: String, required: true },
    name: {type: String},
    experience: {type: Number},
    language: {type: String},
    passwordHash: { type: String, required: true },
    verified: { type: Boolean, required: true, default: false },
});

export const User = mongoose.model("reactUser", userSchema);
