import express from "express";

const router = express.Router();

// TEST REGISTER
router.post("/register", (req, res) => {
  console.log("REGISTER HIT:", req.body);

  return res.json({
    success: true,
    message: "Register working 🚀",
  });
});

// TEST LOGIN
router.post("/login", (req, res) => {
  console.log("LOGIN HIT:", req.body);

  return res.json({
    success: true,
    message: "Login working 🚀",
  });
});

export default router;