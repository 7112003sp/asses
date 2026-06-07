const axios = require("axios");
const db = require("../config/db");

const analyzeProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const response = await axios.get(
      `https://api.github.com/users/${username}`
    );

    const user = response.data;

    await db.execute(
      `INSERT INTO github_profiles
      (username, name, followers, following, public_repos)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      followers=?,
      following=?,
      public_repos=?`,
      [
        user.login,
        user.name,
        user.followers,
        user.following,
        user.public_repos,
        user.followers,
        user.following,
        user.public_repos
      ]
    );

    res.json({
      message: "Profile analyzed and saved",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getAllProfiles = async (req, res) => {
  const [rows] = await db.execute(
    "SELECT * FROM github_profiles"
  );

  res.json(rows);
};

const getSingleProfile = async (req, res) => {
  const [rows] = await db.execute(
    "SELECT * FROM github_profiles WHERE username=?",
    [req.params.username]
  );

  if (!rows.length) {
    return res.status(404).json({
      message: "Profile not found"
    });
  }

  res.json(rows[0]);
};

module.exports = {
  analyzeProfile,
  getAllProfiles,
  getSingleProfile
};