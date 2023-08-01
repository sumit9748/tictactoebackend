const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const boardSchema = new mongoose.Schema(
  {
    users: {
      type: Array,
      default: [],
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
    type: {
      type: Number,
      enum: [1, 2, 3],
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Board", boardSchema);
