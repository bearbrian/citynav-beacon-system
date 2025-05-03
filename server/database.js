const Database = require("better-sqlite3");

const SQL_CMD = {
  dropDB: `
        DROP TABLE IF EXISTS spot_images;
        DROP TABLE IF EXISTS spots;
        DROP TABLE IF EXISTS beacons;
        DROP TABLE IF EXISTS attractions;
        DROP TABLE IF EXISTS users;
    `,
  createTableUsers: `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            is_admin INTEGER NOT NULL DEFAULT 0
        )
    `,
  createTableAttractions: `
        CREATE TABLE IF NOT EXISTS attractions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nameEn TEXT NOT NULL,
            nameTc TEXT NOT NULL,
            descriptionEn TEXT NOT NULL,
            descriptionTc TEXT NOT NULL,
            audioEn TEXT NOT NULL,
            audioTc TEXT NOT NULL,
            imageUrl TEXT NOT NULL
        )
    `,
  createTableSpots: `
        CREATE TABLE IF NOT EXISTS spots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nameEn TEXT NOT NULL,
            nameTc TEXT NOT NULL,
            descriptionEn TEXT NOT NULL,
            descriptionTc TEXT NOT NULL,
            audioEn TEXT NOT NULL,
            audioTc TEXT NOT NULL,
            attractionId INTEGER,
            beaconUuid TEXT,
            beaconMajor INTEGER,
            beaconMinor INTEGER,
            FOREIGN KEY (attractionId) REFERENCES attractions(id),
            FOREIGN KEY (beaconUuid) REFERENCES beacons(uuid) ON DELETE SET NULL
        )
    `,
  createTableSpotImages: `
        CREATE TABLE IF NOT EXISTS spot_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            spotId INTEGER NOT NULL,
            imageUrl TEXT NOT NULL,
            FOREIGN KEY (spotId) REFERENCES spots(id) ON DELETE CASCADE
        )
    `,
  createTableBeacons: `
        CREATE TABLE IF NOT EXISTS beacons (
            uuid TEXT PRIMARY KEY,
            description TEXT NOT NULL
        )
    `,
  createUser: `
        INSERT OR IGNORE INTO users (username, password, is_admin) 
        VALUES (@username, @password, @is_admin)
    `,
  createAttraction: `
        INSERT OR IGNORE INTO attractions (nameEn, nameTc, descriptionEn, descriptionTc, audioEn, audioTc, imageUrl) 
        VALUES (@nameEn, @nameTc, @descriptionEn, @descriptionTc, @audioEn, @audioTc, @imageUrl)
    `,
  updateAttraction: `
        UPDATE attractions 
        SET nameEn = @nameEn, 
            nameTc = @nameTc, 
            descriptionEn = @descriptionEn, 
            descriptionTc = @descriptionTc, 
            audioEn = @audioEn, 
            audioTc = @audioTc, 
            imageUrl = @imageUrl 
        WHERE id = @id
    `,
  createSpot: `
        INSERT OR IGNORE INTO spots (nameEn, nameTc, descriptionEn, descriptionTc, audioEn, audioTc, attractionId, beaconUuid, beaconMajor, beaconMinor) 
        VALUES (@nameEn, @nameTc, @descriptionEn, @descriptionTc, @audioEn, @audioTc, @attractionId, @beaconUuid, @beaconMajor, @beaconMinor)
    `,
  updateSpot: `
        UPDATE spots 
        SET nameEn = @nameEn, 
            nameTc = @nameTc, 
            descriptionEn = @descriptionEn, 
            descriptionTc = @descriptionTc, 
            audioEn = @audioEn, 
            audioTc = @audioTc, 
            attractionId = @attractionId, 
            beaconUuid = @beaconUuid, 
            beaconMajor = @beaconMajor, 
            beaconMinor = @beaconMinor 
        WHERE id = @id
    `,
  createSpotImage: `
        INSERT OR IGNORE INTO spot_images (spotId, imageUrl) 
        VALUES (@spotId, @imageUrl)
    `,
  clearSpotImages: `
        DELETE FROM spot_images WHERE spotId = @spotId
    `,
  createBeacon: `
        INSERT OR IGNORE INTO beacons (uuid, description) 
        VALUES (@uuid, @description)
    `,
  getUser: `
        SELECT * FROM users WHERE username = @username
    `,
  getUsers: `
        SELECT id, username, is_admin FROM users
    `,
  updateUserAdminStatus: `
        UPDATE users SET is_admin = @is_admin WHERE username = @username
    `,
  getBeacons: `
        SELECT uuid, description FROM beacons WHERE (@uuid IS NULL OR uuid = @uuid)
    `,
  getAttractions: `
        SELECT id, nameEn, nameTc, descriptionEn, descriptionTc, audioEn, audioTc, imageUrl FROM attractions
    `,
  getSpots: `
    SELECT 
      s.id, 
      s.nameEn, 
      s.nameTc, 
      s.descriptionEn, 
      s.descriptionTc, 
      s.audioEn, 
      s.audioTc, 
      s.attractionId, 
      s.beaconUuid, 
      s.beaconMajor, 
      s.beaconMinor,
      GROUP_CONCAT(si.imageUrl) AS imageUrls
    FROM spots s
    LEFT JOIN spot_images si ON s.id = si.spotId
    WHERE (@attractionId IS NULL OR s.attractionId = @attractionId)
    GROUP BY s.id
  `,
};

class AttractionDB {
  constructor() {
    this.db = new Database("database.db", { verbose: console.log });
    this.initializeTables();
    this.insertDefaultData();
  }

  initializeTables() {
    this.db.exec(SQL_CMD.dropDB);
    this.db.exec(SQL_CMD.createTableUsers);
    this.db.exec(SQL_CMD.createTableAttractions);
    this.db.exec(SQL_CMD.createTableBeacons);
    this.db.exec(SQL_CMD.createTableSpots);
    this.db.exec(SQL_CMD.createTableSpotImages);
  }

  insertDefaultData() {
    const defaultData = require("./data").defaultData;

    defaultData.users.forEach(({ username, password, is_admin }) => {
      this.db.prepare(SQL_CMD.createUser).run({
        username,
        password,
        is_admin: is_admin ? 1 : 0,
      });
    });

    defaultData.attractions.forEach(
      ({
        nameEn,
        nameTc,
        descriptionEn,
        descriptionTc,
        audioEn,
        audioTc,
        imageUrl,
      }) => {
        this.db.prepare(SQL_CMD.createAttraction).run({
          nameEn,
          nameTc,
          descriptionEn,
          descriptionTc,
          audioEn,
          audioTc,
          imageUrl,
        });
      }
    );

    defaultData.beacons.forEach(({ uuid, description }) => {
      this.db.prepare(SQL_CMD.createBeacon).run({
        uuid,
        description,
      });
    });

    defaultData.spots.forEach(
      ({
        nameEn,
        nameTc,
        descriptionEn,
        descriptionTc,
        audioEn,
        audioTc,
        attractionId,
        beaconUuid,
        beaconMajor,
        beaconMinor,
      }) => {
        this.db.prepare(SQL_CMD.createSpot).run({
          nameEn,
          nameTc,
          descriptionEn,
          descriptionTc,
          audioEn,
          audioTc,
          attractionId: attractionId || null,
          beaconUuid: beaconUuid || null,
          beaconMajor: beaconMajor || null,
          beaconMinor: beaconMinor || null,
        });
      }
    );

    defaultData.spot_images.forEach(({ spotId, imageUrl }) => {
      this.db.prepare(SQL_CMD.createSpotImage).run({
        spotId,
        imageUrl,
      });
    });
  }

  getUser(username) {
    return this.db.prepare(SQL_CMD.getUser).get({ username });
  }

  getUsers() {
    return this.db.prepare(SQL_CMD.getUsers).all();
  }

  addUser(username, password, is_admin) {
    return this.db
      .prepare(SQL_CMD.createUser)
      .run({ username, password, is_admin });
  }

  updateUserAdminStatus(username, is_admin) {
    return this.db
      .prepare(SQL_CMD.updateUserAdminStatus)
      .run({ username, is_admin });
  }

  getBeacons(uuid = null) {
    return this.db.prepare(SQL_CMD.getBeacons).all({ uuid });
  }

  getAttractions() {
    return this.db.prepare(SQL_CMD.getAttractions).all();
  }

  getSpots(attractionId = null) {
    const spots = this.db.prepare(SQL_CMD.getSpots).all({ attractionId });

    return spots.map((spot) => ({
      ...spot,
      images: spot.imageUrls ? spot.imageUrls.split(",") : [],
    }));
  }

  createAttraction(data) {
    return this.db.prepare(SQL_CMD.createAttraction).run(data);
  }

  updateAttraction(id, data) {
    return this.db.prepare(SQL_CMD.updateAttraction).run({ id, ...data });
  }

  createSpot(data) {
    return this.db.prepare(SQL_CMD.createSpot).run(data);
  }

  updateSpot(id, data) {
    return this.db.prepare(SQL_CMD.updateSpot).run({ id, ...data });
  }

  createSpotImage(spotId, imageUrl) {
    return this.db.prepare(SQL_CMD.createSpotImage).run({ spotId, imageUrl });
  }

  clearSpotImages(spotId) {
    return this.db.prepare(SQL_CMD.clearSpotImages).run({ spotId });
  }

  createBeacon(data) {
    return this.db.prepare(SQL_CMD.createBeacon).run(data);
  }
}

module.exports = new AttractionDB();
