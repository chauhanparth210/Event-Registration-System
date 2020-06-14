const router = require("express").Router();
const { overview, details } = require("../controller/AdminControllers");
const { userAuth, checkRole } = require("../utils/Auth");

router.get("/overview", userAuth, checkRole(["admin"]), async (req, res) => {
  return await overview(res);
});

router.get("/details", userAuth, checkRole(["admin"]), async (req, res) => {
  return await details(res);
});

module.exports = router;
