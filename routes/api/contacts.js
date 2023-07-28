const express = require("express");

const ctrl = require("../../controllers/contacts");

const { isValidId, authenticate } = require("../../middlewares");

const router = express.Router();

router.get("/", authenticate, ctrl.getAll);

router.get("/:id", authenticate, isValidId, ctrl.getById);

router.post("/", authenticate, ctrl.addCnt);

router.put("/:id", authenticate, isValidId, ctrl.updateById);

router.patch("/:id/favorite", authenticate, isValidId, ctrl.updateFavorite);

router.delete("/:id", authenticate, isValidId, ctrl.deleteById);

module.exports = router;
