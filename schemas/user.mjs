import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email:{
    type: String,
    require: true,
    unique: true
  },
  password:{
    type: String,
    require: true,
  }, 
  created_at:{
    type: Date,
    default: Date.now
  }
});

const UserModel = mongoose.model("users", userSchema);
export default UserModel;
