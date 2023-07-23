const express = require("express");

const ctrl = require("../../controllers/contacts");

const { isValidId } = require("../../middlewares");

const router = express.Router();

router.get("/", ctrl.getAll);

router.get("/:id", isValidId, ctrl.getById);

router.post("/", ctrl.addCnt);

router.put("/:id", isValidId, ctrl.updateById);

router.patch("/:id/favorite", isValidId, ctrl.updateFavorite);

router.delete("/:id", isValidId, ctrl.deleteById);

module.exports = router;
