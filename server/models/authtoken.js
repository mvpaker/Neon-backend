import mongoose from "mongoose";

const authTokenSchema = mongoose.Schema({
    type: { type: String, required: true },
    token: { type: String, required: true },
    email: { type: String, required: true }
});

export const AuthToken = mongoose.model("authToken", authTokenSchema);
