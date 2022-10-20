import mongoose from "mongoose";

const customerSchema = mongoose.Schema({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  phoneNumber: { type: String, required: false },
  location: { type: String, required: false },
  isInterpreter: { type: String, required: false },
  company: { type: String, required: false }
});

export const Customer = mongoose.model("reactCustomer", customerSchema);
