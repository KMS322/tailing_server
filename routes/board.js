const express = require("express");
const router = express.Router();
const { Board } = require("../models");

router.get("/loadAll", async (req, res, next) => {
  try {
    const boards = await Board.findAll();

    if(!boards) {
      return res.status(404).json({ message: "게시판이 존재하지 않습니다." });
    }

    res.status(200).json(boards);
  } catch(e) {
    console.error(e);
    next(e);
  }
});

router.post("/load", async (req, res, next) => {
  try {
    const { board_code } = req.body;

    const board = await Board.findOne({
      where: {
        board_code: board_code,
      },
    });

    if(!board) {
      return res.status(404).json({ message: "게시판이 존재하지 않습니다." });
    }

    res.status(200).json(board);  
    
    
  } catch(e) {
    console.error(e);
    next(e);
  }
});
module.exports = router;

