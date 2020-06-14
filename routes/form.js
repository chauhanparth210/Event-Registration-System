const router = require("express").Router();
const {
  sendFormLink,
  postUserData,
  isTokenExpired,
} = require("../controller/FormControllers");

router.post("/form-link", async (req, res) => {
  await sendFormLink(req.body, res);
});

router.post("/:token", async (req, res) => {
  await postUserData(req.body, req.params.token, res);
});

router.post("/token/:token", async (req, res) => {
  await isTokenExpired(req.params.token, res);
});

module.exports = router;
