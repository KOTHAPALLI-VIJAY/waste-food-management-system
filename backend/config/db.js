require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

let pool = null;
let useJsonStore = false;
const dataDir = process.env.DATA_DIR || path.join(__dirname, "../data");
const dbFilePath = path.join(dataDir, "db.json");

// Ensure data folder exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// ------------------------------------------------------------------
// JSON fallback helpers (used when MySQL is unavailable)
// ------------------------------------------------------------------
const readDb = () => {
  if (!fs.existsSync(dbFilePath)) {
    const seed = { users: [], donations: [] };
    fs.writeFileSync(dbFilePath, JSON.stringify(seed, null, 2));
    return seed;
  }
  return JSON.parse(fs.readFileSync(dbFilePath, "utf-8"));
};

const writeDb = (data) => {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
};

// ------------------------------------------------------------------
// Initial Seed Data
// ------------------------------------------------------------------
// password123 hash for demo donor/ngo accounts
const demoPasswordHash =
  "$2b$10$nhV55x5IQmQf0.my19/G0OQHaYT6IzPZcfLwf4FZjssMmrhAlqWQy"; // password123
// Admin@123 hash for admin accounts
const adminPasswordHash =
  "$2b$10$.LDdFrq43btBS8ovTMEHmefzm9//z.MFgvSYvRtBhC3LzhQfObksq"; // Admin@123

const initialUsers = [
  {
    name: "Grand Feast Hotel & Banquet",
    email: "donor@demo.com",
    phone: "+91 98765 43210",
    password: demoPasswordHash,
    role: "donor",
  },
  {
    name: "Hope & Harvest Food Relief NGO",
    email: "ngo@demo.com",
    phone: "+91 98765 12345",
    password: demoPasswordHash,
    role: "ngo",
  },
  {
    name: "Waste Food Platform Administrator",
    email: "admin@demo.com",
    phone: "+91 98765 99999",
    password: adminPasswordHash,
    role: "admin",
  },
  {
    name: "vijay",
    email: "vijaykothapalli26@gmail.com",
    phone: "+91 98765 00001",
    password: adminPasswordHash,
    role: "admin",
  },
];

// ------------------------------------------------------------------
// Auto-create tables if they don't exist and ensure columns exist
// ------------------------------------------------------------------
const ensureTables = async (connection) => {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`users\` (
      \`id\`         INT NOT NULL AUTO_INCREMENT,
      \`name\`       VARCHAR(100) DEFAULT NULL,
      \`email\`      VARCHAR(100) DEFAULT NULL,
      \`password\`   VARCHAR(255) DEFAULT NULL,
      \`role\`       ENUM('donor','ngo','admin') DEFAULT NULL,
      \`phone\`      VARCHAR(50) DEFAULT NULL,
      \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`email\` (\`email\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`donations\` (
      \`id\`                  VARCHAR(60)  NOT NULL,
      \`foodName\`            VARCHAR(150) DEFAULT NULL,
      \`quantity\`            VARCHAR(50)  DEFAULT NULL,
      \`expiryDate\`          VARCHAR(100) DEFAULT NULL,
      \`location\`            VARCHAR(255) DEFAULT NULL,
      \`status\`              VARCHAR(50)  DEFAULT 'Pending',
      \`donorId\`             INT          DEFAULT NULL,
      \`transactionId\`       VARCHAR(50)  DEFAULT NULL,
      \`category\`            VARCHAR(100) DEFAULT NULL,
      \`dietaryType\`         VARCHAR(50)  DEFAULT NULL,
      \`mealCount\`           INT          DEFAULT 1,
      \`pickupWindow\`        VARCHAR(150) DEFAULT NULL,
      \`latitude\`            DOUBLE       DEFAULT NULL,
      \`longitude\`           DOUBLE       DEFAULT NULL,
      \`donorName\`           VARCHAR(150) DEFAULT NULL,
      \`donorPhone\`          VARCHAR(50)  DEFAULT NULL,
      \`claimedByNgoId\`      VARCHAR(50)  DEFAULT NULL,
      \`claimedByNgoName\`    VARCHAR(150) DEFAULT NULL,
      \`volunteerName\`       VARCHAR(150) DEFAULT NULL,
      \`volunteerPhone\`      VARCHAR(50)  DEFAULT NULL,
      \`estimatedPickupTime\` VARCHAR(100) DEFAULT NULL,
      \`otp\`                 VARCHAR(10)  DEFAULT NULL,
      \`notes\`               TEXT,
      \`co2SavedKg\`          DOUBLE       DEFAULT 0,
      \`deliveredAt\`         VARCHAR(100) DEFAULT NULL,
      \`createdAt\`           TIMESTAMP    NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      KEY \`donorId\` (\`donorId\`),
      CONSTRAINT \`donations_ibfk_1\`
        FOREIGN KEY (\`donorId\`) REFERENCES \`users\` (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  // Ensure any optional columns exist if table was created previously with fewer fields
  const optionalColumns = [
    { name: "transactionId", type: "VARCHAR(50) DEFAULT NULL" },
    { name: "category", type: "VARCHAR(100) DEFAULT NULL" },
    { name: "dietaryType", type: "VARCHAR(50) DEFAULT NULL" },
    { name: "mealCount", type: "INT DEFAULT 1" },
    { name: "pickupWindow", type: "VARCHAR(150) DEFAULT NULL" },
    { name: "latitude", type: "DOUBLE DEFAULT NULL" },
    { name: "longitude", type: "DOUBLE DEFAULT NULL" },
    { name: "donorName", type: "VARCHAR(150) DEFAULT NULL" },
    { name: "donorPhone", type: "VARCHAR(50) DEFAULT NULL" },
    { name: "claimedByNgoId", type: "VARCHAR(50) DEFAULT NULL" },
    { name: "claimedByNgoName", type: "VARCHAR(150) DEFAULT NULL" },
    { name: "volunteerName", type: "VARCHAR(150) DEFAULT NULL" },
    { name: "volunteerPhone", type: "VARCHAR(50) DEFAULT NULL" },
    { name: "estimatedPickupTime", type: "VARCHAR(100) DEFAULT NULL" },
    { name: "otp", type: "VARCHAR(10) DEFAULT NULL" },
    { name: "notes", type: "TEXT" },
    { name: "co2SavedKg", type: "DOUBLE DEFAULT 0" },
    { name: "deliveredAt", type: "VARCHAR(100) DEFAULT NULL" },
  ];

  for (const col of optionalColumns) {
    try {
      await connection.query(
        `ALTER TABLE \`donations\` ADD COLUMN IF NOT EXISTS \`${col.name}\` ${col.type}`
      );
    } catch {
      // Fallback for MySQL versions without ADD COLUMN IF NOT EXISTS
      try {
        const [hasCol] = await connection.query(
          `SHOW COLUMNS FROM \`donations\` LIKE ?`,
          [col.name]
        );
        if (hasCol.length === 0) {
          await connection.query(
            `ALTER TABLE \`donations\` ADD COLUMN \`${col.name}\` ${col.type}`
          );
        }
      } catch {
        // Ignored
      }
    }
  }
};

// ------------------------------------------------------------------
// connectDB
// ------------------------------------------------------------------
const connectDB = async () => {
  const databaseUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
  const host     = process.env.DB_HOST     || "localhost";
  const user     = process.env.DB_USER     || "root";
  const password = process.env.DB_PASSWORD || "root";
  const database = process.env.DB_NAME     || "waste_food_db";
  const port     = Number(process.env.DB_PORT) || 3306;

  try {
    if (databaseUrl) {
      // Connect directly using connection URI (e.g. Aiven, TiDB, Clever Cloud, Railway)
      try {
        const parsed = new URL(databaseUrl);
        const dbName = parsed.pathname.replace(/^\//, "") || "defaultdb";
        pool = mysql.createPool({
          host: parsed.hostname,
          port: Number(parsed.port) || 3306,
          user: decodeURIComponent(parsed.username),
          password: decodeURIComponent(parsed.password),
          database: dbName,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
          ssl: process.env.DB_SSL === "false" ? false : { rejectUnauthorized: false },
        });
      } catch {
        pool = mysql.createPool({
          uri: databaseUrl,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
          ssl: process.env.DB_SSL === "false" ? false : { rejectUnauthorized: false },
        });
      }
    } else {
      // Create DB if it doesn't exist on local/custom server
      try {
        const conn = await mysql.createConnection({ host, user, password, port });
        await conn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
        await conn.end();
      } catch (e) {
        // Ignored if user doesn't have CREATE DATABASE privileges on managed host
      }

      const sslConfig = process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false;

      pool = mysql.createPool({
        host,
        user,
        password,
        database,
        port,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        ssl: sslConfig,
      });
    }

    // Ensure tables exist
    await ensureTables(pool);

    // Seed users if empty
    const [uRows] = await pool.query("SELECT COUNT(*) as cnt FROM users");
    if (uRows[0].cnt === 0) {
      for (const u of initialUsers) {
        await pool.query(
          "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)",
          [u.name, u.email, u.phone, u.password, u.role]
        );
      }
      console.log("Seeded initial users into MySQL.");
    }

    // Get donor id for sample donations
    const [donorUser] = await pool.query(
      "SELECT id FROM users WHERE role = 'donor' LIMIT 1"
    );
    const donorId = donorUser.length > 0 ? donorUser[0].id : null;

    // Seed donations if empty
    const [dRows] = await pool.query("SELECT COUNT(*) as cnt FROM donations");
    if (dRows[0].cnt === 0 && donorId) {
      const sampleDonations = [
        {
          id: "don_101",
          transactionId: "TXN-WFM-8421",
          foodName: "Surplus Buffet Rice, Dal & Vegetable Curry",
          category: "Cooked Meals",
          dietaryType: "Veg",
          quantity: "45 Meals (approx 20 kg)",
          mealCount: 45,
          expiryDate: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
          pickupWindow: "Ready now - Collect by 11:30 PM",
          location: "Banjara Hills, Road No. 12, Hyderabad",
          latitude: 17.4156,
          longitude: 78.4357,
          status: "Pending",
          donorId,
          donorName: "Grand Feast Hotel & Banquet",
          donorPhone: "+91 98765 43210",
          otp: "4821",
          notes: "Packed in sanitized food containers. Keep warm.",
          co2SavedKg: 81.0,
          claimedByNgoId: null,
          claimedByNgoName: null,
          volunteerName: null,
          volunteerPhone: null,
          estimatedPickupTime: null,
          deliveredAt: null,
        },
        {
          id: "don_102",
          transactionId: "TXN-WFM-7319",
          foodName: "Fresh Bakery Breads, Croissants & Tea Cakes",
          category: "Bakery",
          dietaryType: "Veg",
          quantity: "60 Packets (approx 15 kg)",
          mealCount: 60,
          expiryDate: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
          pickupWindow: "Collect between 8 AM - 12 PM",
          location: "Madhapur Main Road, Near Metro Station, Hyderabad",
          latitude: 17.4483,
          longitude: 78.3915,
          status: "Claimed",
          donorId,
          donorName: "Grand Feast Bakery",
          donorPhone: "+91 98765 43210",
          claimedByNgoId: "2",
          claimedByNgoName: "Hope & Harvest Food Relief",
          volunteerName: "Rajesh Kumar (Volunteer Driver)",
          volunteerPhone: "+91 91234 56789",
          estimatedPickupTime: "Within 45 mins",
          otp: "6934",
          notes: "Dry baked goods in sealed cartons.",
          co2SavedKg: 108.0,
          deliveredAt: null,
        },
        {
          id: "don_103",
          transactionId: "TXN-WFM-5102",
          foodName: "Nutritious Paneer Biryani & Fresh Curd",
          category: "Cooked Meals",
          dietaryType: "Veg",
          quantity: "80 Servings (approx 35 kg)",
          mealCount: 80,
          expiryDate: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
          pickupWindow: "Completed",
          location: "Gachibowli Stadium Road, Hyderabad",
          latitude: 17.4401,
          longitude: 78.3489,
          status: "Accepted",
          donorId,
          donorName: "Grand Feast Hotel",
          donorPhone: "+91 98765 43210",
          claimedByNgoId: "2",
          claimedByNgoName: "Hope & Harvest Food Relief",
          volunteerName: "Anita Sharma",
          volunteerPhone: "+91 98760 11223",
          estimatedPickupTime: null,
          otp: "3185",
          deliveredAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
          co2SavedKg: 144.0,
          notes: "Successfully distributed to Rainbow Children Shelter.",
        },
      ];

      for (const d of sampleDonations) {
        await pool.query(
          `INSERT INTO donations (
            id, transactionId, foodName, category, dietaryType, quantity,
            mealCount, expiryDate, pickupWindow, location, latitude, longitude,
            status, donorId, donorName, donorPhone, claimedByNgoId, claimedByNgoName,
            volunteerName, volunteerPhone, estimatedPickupTime, otp, notes, co2SavedKg, deliveredAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            d.id, d.transactionId, d.foodName, d.category, d.dietaryType, d.quantity,
            d.mealCount, d.expiryDate, d.pickupWindow, d.location, d.latitude, d.longitude,
            d.status, d.donorId, d.donorName, d.donorPhone,
            d.claimedByNgoId || null, d.claimedByNgoName || null,
            d.volunteerName || null, d.volunteerPhone || null,
            d.estimatedPickupTime || null, d.otp, d.notes,
            d.co2SavedKg || 0, d.deliveredAt || null,
          ]
        );
      }
      console.log("Seeded initial donations into MySQL.");
    }

    useJsonStore = false;
    console.log(`Connected to MySQL Database (${database}) successfully.`);
  } catch (err) {
    useJsonStore = true;
    console.warn(
      `MySQL connection failed (${err.code || err.message}). Falling back to local JSON store.`
    );
  }
};

module.exports = {
  connectDB,
  getPool:     () => pool,
  isJsonStore: () => useJsonStore,
  readDb,
  writeDb,
};
