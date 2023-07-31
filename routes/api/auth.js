const express = require("express");

const ctrl = require("../../controllers/auth");

const { isValidUser } = require("../../middlewares");

const { authenticate, upload } = require("../../middlewares");

const router = express.Router();

router.post("/register", ctrl.register);

router.post("/login", ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch("/:id/subscription", authenticate, isValidUser, ctrl.updateSubscriptionUser);

router.patch("/avatars", authenticate, upload.single("avatar"), ctrl.updateAvatar)

module.exports = router;


