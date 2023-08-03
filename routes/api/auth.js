const express = require("express");

const ctrl = require("../../controllers/auth");

const { isValidId } = require("../../middlewares");

const { authenticate, upload, validateBody } = require("../../middlewares");

const {schemas} = require("../../models/user");


const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.get("/verify/:verificationToken", ctrl.verifyEmail);

router.post("/verify", validateBody(schemas.verifyEmail), ctrl.resendVerifyEmail)

router.post("/login", ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch("/:id/subscription", authenticate, isValidId, ctrl.updateSubscriptionUser);

router.patch("/avatars", authenticate, upload.single("avatar"), ctrl.updateAvatar)

module.exports = router;


