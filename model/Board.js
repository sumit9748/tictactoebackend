const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const boardSchema = new mongoose.Schema(
  {
    users: {
      type: Array,
    },
    status: {
      type: Boolean,
      default: false,
    },
    boardStatus: {
      type: Array,
      default: ["", "", "", "", "", "", "", "", ""],
    },
    lastMove: {
      type: String,
      default: "",
    },
    fill: {
      type: Number,
      default: 0,
    },
    type: {
      type: Number,
      enum: [1, 2, 3],
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Board", boardSchema);
