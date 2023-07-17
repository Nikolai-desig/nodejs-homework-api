const express = require("express");

const ctrl = require("../../controllers/contacts")

const router = express.Router();

router.get("/", ctrl.getAll);

router.get("/:id", ctrl.getById);

router.post("/", ctrl.addCnt);

router.put("/:id", ctrl.updateById);

router.delete("/:id", ctrl.deleteById);

module.exports = router;
