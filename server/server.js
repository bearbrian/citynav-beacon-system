const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const AttractionDB = require("./database");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const authenticatedUsers = new Map();

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token || !authenticatedUsers.has(token)) {
    return res.status(401).json({ error: "Unauthorized: Please log in" });
  }

  const user = authenticatedUsers.get(token);
  req.user = user;
  next();
};

const adminMiddleware = (req, res, next) => {
  if (!req.user.is_admin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }
  next();
};

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  const user = AttractionDB.getUser(username);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const token = `${username}-${Date.now()}`;
  authenticatedUsers.set(token, user);

  res.json({
    token,
    user: { username: user.username, is_admin: !!user.is_admin },
  });
});

app.post("/api/logout", authMiddleware, (req, res) => {
  const token = req.headers["authorization"];
  authenticatedUsers.delete(token);
  res.json({ message: "Logged out successfully" });
});

app.post("/api/users", authMiddleware, adminMiddleware, (req, res) => {
  const { username, password, is_admin } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const result = AttractionDB.addUser(username, password, is_admin ? 1 : 0);
    if (result.changes === 0) {
      return res.status(409).json({ error: "Username already exists" });
    }
    res.status(201).json({ message: "User created successfully", username });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ error: "Failed to create user", details: error.message });
  }
});

app.patch(
  "/api/users/:username",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    const { username } = req.params;
    const { is_admin } = req.body;

    if (typeof is_admin !== "boolean") {
      return res.status(400).json({ error: "is_admin must be a boolean" });
    }

    if (req.user.username === username) {
      return res
        .status(403)
        .json({ error: "Cannot modify your own admin status" });
    }

    const user = AttractionDB.getUser(username);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    try {
      AttractionDB.updateUserAdminStatus(username, is_admin ? 1 : 0);
      res.json({
        message: `User ${username}'s admin status updated to ${is_admin}`,
      });
    } catch (error) {
      console.error("Error updating user admin status:", error);
      res
        .status(500)
        .json({ error: "Failed to update user", details: error.message });
    }
  }
);

app.get("/api/users", authMiddleware, (req, res) => {
  try {
    const users = AttractionDB.getUsers();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    const sanitizedUsers = users.map(({ id, username, is_admin }) => ({
      id,
      username,
      is_admin: !!is_admin,
    }));
    res.json(sanitizedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch users", details: error.message });
  }
});

app.get("/api/beacons", authMiddleware, (req, res) => {
  try {
    const { uuid } = req.query;
    const beacons = AttractionDB.getBeacons(uuid || null);
    if (!beacons || beacons.length === 0) {
      return res.status(404).json({ message: "No beacons found" });
    }
    res.json(beacons);
  } catch (error) {
    console.error("Error fetching beacons:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch beacons", details: error.message });
  }
});

app.get("/api/attractions", authMiddleware, (req, res) => {
  try {
    const attractions = AttractionDB.getAttractions();
    if (!attractions || attractions.length === 0) {
      return res.status(404).json({ message: "No attractions found" });
    }
    res.json(attractions);
  } catch (error) {
    console.error("Error fetching attractions:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch attractions", details: error.message });
  }
});

app.post("/api/attractions", authMiddleware, adminMiddleware, (req, res) => {
  const {
    nameEn,
    nameTc,
    descriptionEn,
    descriptionTc,
    audioEn,
    audioTc,
    imageUrl,
  } = req.body;

  if (
    !nameEn ||
    !nameTc ||
    !descriptionEn ||
    !descriptionTc ||
    !audioEn ||
    !audioTc ||
    !imageUrl
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = AttractionDB.createAttraction({
      nameEn,
      nameTc,
      descriptionEn,
      descriptionTc,
      audioEn,
      audioTc,
      imageUrl,
    });
    if (result.changes === 0) {
      return res.status(409).json({ error: "Attraction already exists" });
    }
    res.status(201).json({ message: "Attraction created successfully" });
  } catch (error) {
    console.error("Error creating attraction:", error);
    res
      .status(500)
      .json({ error: "Failed to create attraction", details: error.message });
  }
});

app.patch(
  "/api/attractions/:id",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    const { id } = req.params;
    const {
      nameEn,
      nameTc,
      descriptionEn,
      descriptionTc,
      audioEn,
      audioTc,
      imageUrl,
    } = req.body;

    if (
      !nameEn ||
      !nameTc ||
      !descriptionEn ||
      !descriptionTc ||
      !audioEn ||
      !audioTc ||
      !imageUrl
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const result = AttractionDB.updateAttraction(id, {
        nameEn,
        nameTc,
        descriptionEn,
        descriptionTc,
        audioEn,
        audioTc,
        imageUrl,
      });
      if (result.changes === 0) {
        return res.status(404).json({ error: "Attraction not found" });
      }
      res.json({ message: "Attraction updated successfully" });
    } catch (error) {
      console.error("Error updating attraction:", error);
      res
        .status(500)
        .json({ error: "Failed to update attraction", details: error.message });
    }
  }
);

app.get("/api/spots", authMiddleware, (req, res) => {
  try {
    const { attractionId } = req.query;
    let parsedAttractionId = null;
    if (attractionId) {
      parsedAttractionId = parseInt(attractionId, 10);
      if (isNaN(parsedAttractionId) || parsedAttractionId <= 0) {
        return res
          .status(400)
          .json({ error: "Invalid attractionId: Must be a positive integer" });
      }
    }
    const spots = AttractionDB.getSpots(parsedAttractionId);
    if (!spots || spots.length === 0) {
      return res
        .status(404)
        .json({ message: "No spots found", count: 0, data: [] });
    }
    res.json({
      message: "Spots retrieved successfully",
      count: spots.length,
      data: spots,
    });
  } catch (error) {
    console.error("Error fetching spots:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch spots", details: error.message });
  }
});

app.post("/api/spots", authMiddleware, adminMiddleware, (req, res) => {
  const {
    nameEn,
    nameTc,
    descriptionEn,
    descriptionTc,
    attractionId,
    beaconUuid,
    beaconMajor,
    beaconMinor,
    audioEn,
    audioTc,
    images,
  } = req.body;

  if (
    !nameEn ||
    !nameTc ||
    !descriptionEn ||
    !descriptionTc ||
    !attractionId ||
    !beaconUuid ||
    beaconMajor == null ||
    beaconMinor == null ||
    !audioEn ||
    !audioTc
  ) {
    return res
      .status(400)
      .json({ error: "All fields are required except images" });
  }

  try {
    const result = AttractionDB.createSpot({
      nameEn,
      nameTc,
      descriptionEn,
      descriptionTc,
      attractionId,
      beaconUuid,
      beaconMajor,
      beaconMinor,
      audioEn,
      audioTc,
    });
    if (result.changes === 0) {
      return res.status(409).json({ error: "Spot already exists" });
    }
    const spotId = result.lastInsertRowid;
    if (images && Array.isArray(images) && images.length > 0) {
      images.forEach((imageUrl) => {
        AttractionDB.createSpotImage(spotId, imageUrl);
      });
    }
    res.status(201).json({ message: "Spot created successfully" });
  } catch (error) {
    console.error("Error creating spot:", error);
    res
      .status(500)
      .json({ error: "Failed to create spot", details: error.message });
  }
});

app.patch("/api/spots/:id", authMiddleware, adminMiddleware, (req, res) => {
  const { id } = req.params;
  const {
    nameEn,
    nameTc,
    descriptionEn,
    descriptionTc,
    attractionId,
    beaconUuid,
    beaconMajor,
    beaconMinor,
    audioEn,
    audioTc,
    images,
  } = req.body;

  if (
    !nameEn ||
    !nameTc ||
    !descriptionEn ||
    !descriptionTc ||
    !attractionId ||
    !beaconUuid ||
    beaconMajor == null ||
    beaconMinor == null ||
    !audioEn ||
    !audioTc
  ) {
    return res
      .status(400)
      .json({ error: "All fields are required except images" });
  }

  try {
    const result = AttractionDB.updateSpot(id, {
      nameEn,
      nameTc,
      descriptionEn,
      descriptionTc,
      attractionId,
      beaconUuid,
      beaconMajor,
      beaconMinor,
      audioEn,
      audioTc,
    });
    if (result.changes === 0) {
      return res.status(404).json({ error: "Spot not found" });
    }
    // Clear existing images and insert new ones
    AttractionDB.clearSpotImages(id);
    if (images && Array.isArray(images) && images.length > 0) {
      images.forEach((imageUrl) => {
        AttractionDB.createSpotImage(id, imageUrl);
      });
    }
    res.json({ message: "Spot updated successfully" });
  } catch (error) {
    console.error("Error updating spot:", error);
    res
      .status(500)
      .json({ error: "Failed to update spot", details: error.message });
  }
});

const privateKey = fs.readFileSync("key.pem", "utf8");
const certificate = fs.readFileSync("cert.pem", "utf8");
const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`Server running at https://localhost:${port}`);
});
