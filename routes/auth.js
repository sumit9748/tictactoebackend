const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//register
router.post("/register", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    name: req.body.name,
  });
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) res.status(403).json("User already exists");
    else {
      const savedUser = await newUser.save();
      res.status(200).json(savedUser);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//login

router.post("/login", async (req, res) => {
  try {
    // if (req.body.password === "" || !req.body.username === "")
    //   res.status(500).json("give the details fullfilled");

    const user = await User.findOne({ username: req.body.username });
    if (!user) res.status(401).json("wrong credentials");
    else {
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) res.status(400).json("unvalid password");
      else {
        const accessToken = jwt.sign(
          {
            id: user._id,
          },
          process.env.JWT_SEC,
          { expiresIn: "3d" }
        );

        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/getuser/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(403).json("Sorry no user matching");
    } else res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
