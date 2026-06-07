const express = require("express");

const router = express.Router();

const {
  analyzeProfile,
  getAllProfiles,
  getSingleProfile
} = require("../controller/github");

router.post("/github/:username", analyzeProfile);

router.get("/profiles", getAllProfiles);

router.get("/profiles/:username", getSingleProfile);

module.exports = router;