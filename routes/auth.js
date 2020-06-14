const router = require("express").Router();
const { userRegister, userLogin } = require("../controller/AuthControllers");

// router.post("/register-user", async (req, res) => {
//   await userRegister(req.body, "user", res);
// });

router.post("/register-admin", async (req, res) => {
  await userRegister(req.body, "admin", res);
});

// router.post("/login-user", async (req, res) => {
//   await userLogin(req.body, "user", res);
// });

router.post("/login-admin", async (req, res) => {
  await userLogin(req.body, "admin", res);
});

module.exports = router;
