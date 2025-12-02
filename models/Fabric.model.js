const mongoose = require("mongoose");

const fabricSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    description: {
      type: String,
      default: ""
    },
    image: {
      type: String, 
      default: ""
    }
  },
  { timestamps: true }
);
const Fabric = mongoose.model("Fabric", fabricSchema);
module.exports = Fabric;
