const router = require("express").Router();
const Board = require("../model/Board");

router.post("/", async (req, res) => {
  const newBoard = new Board(req.body);
  // console.log(req.body.users[0], req.body.users[1]);
  try {
    const boardChecker = await Board.find({
      users: { $all: [req.body.users[0], req.body.users[1]] },
      status: false,
    });
    if (boardChecker.length > 0) {
      return res.status(401).json("Please complete your previous game");
    } else {
      const saved = await newBoard.save();
      res.status(200).json(saved);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    await Board.findByIdAndUpdate(
      req.params.id,
      {
        boardStatus: req.body.boardStatus,
        status: req.body.status,
        lastMove: req.body.lastMove,
        fill: req.body.fill,
        type: req.body.type,
      },
      { new: true }
    );
    res.status(200).json("Board updated successfully");
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Board.find({
      users: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/boardSp/:id", async (req, res) => {
  try {
    const board = await Board.findById(req.params.id).sort({
      createdAt: "ascending",
    });
    res.status(200).json(board);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
