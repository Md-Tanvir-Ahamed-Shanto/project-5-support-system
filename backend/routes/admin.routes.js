const express = require("express");
const router = express.Router();
const { adminController } = require("../controllers");

router.post("/users", adminController.addUser);
router.get("/users", adminController.getAllUsers);
router.put("/users/:id", adminController.editUser);
router.delete("/users/:id", adminController.deleteUser);

router.get("/complaints", adminController.getAllComplaints);
router.put("/complaints/:id/status", adminController.updateComplaintStatus);
router.delete("/complaints/:id", adminController.deleteComplaint);
router.delete("/complaints/cleanup", adminController.deleteOldComplaints);

module.exports = router;