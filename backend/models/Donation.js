const { readDb, writeDb, getPool, isJsonStore } = require("../config/db");

// Columns that are valid in the MySQL donations table
const VALID_COLUMNS = new Set([
  "foodName", "quantity", "expiryDate", "location", "status",
  "donorId", "transactionId", "category", "dietaryType", "mealCount",
  "pickupWindow", "latitude", "longitude", "donorName", "donorPhone",
  "claimedByNgoId", "claimedByNgoName", "volunteerName", "volunteerPhone",
  "estimatedPickupTime", "otp", "notes", "co2SavedKg", "deliveredAt",
]);

const Donation = {
  async find(query = {}) {
    if (isJsonStore()) {
      const db = readDb();
      if (Object.keys(query).length === 0) {
        return [...db.donations].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      }
      return db.donations
        .filter((d) => {
          for (const key of Object.keys(query)) {
            if (d[key] !== query[key]) return false;
          }
          return true;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      const pool = getPool();
      const keys = Object.keys(query);
      let sql = "SELECT * FROM donations";
      let values = [];
      if (keys.length > 0) {
        sql += " WHERE " + keys.map((k) => `\`${k}\` = ?`).join(" AND ");
        values = keys.map((k) => query[k]);
      }
      sql += " ORDER BY createdAt DESC";
      const [rows] = await pool.query(sql, values);
      return rows.map((r) => ({ ...r, _id: r.id }));
    }
  },

  async findById(id) {
    if (isJsonStore()) {
      const db = readDb();
      return db.donations.find((d) => d._id === id || d.id === id) || null;
    } else {
      const pool = getPool();
      const [rows] = await pool.query(
        "SELECT * FROM donations WHERE id = ? LIMIT 1",
        [id]
      );
      if (rows.length === 0) return null;
      return { ...rows[0], _id: rows[0].id };
    }
  },

  async create(data) {
    const id =
      data._id || "don_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    const txn =
      data.transactionId ||
      "TXN-WFM-" + Math.floor(1000 + Math.random() * 9000);
    const otp = data.otp || String(Math.floor(1000 + Math.random() * 9000));
    const donorIntId =
      Number(data.donorId) > 0 ? Number(data.donorId) : null;

    const newDonation = {
      _id: id,
      id,
      transactionId: txn,
      foodName: data.foodName || "Surplus Food",
      category: data.category || "Cooked Meals",
      dietaryType: data.dietaryType || "Veg",
      quantity: data.quantity || "10 Meals",
      mealCount: Number(data.mealCount) || parseInt(data.quantity) || 10,
      expiryDate:
        data.expiryDate ||
        new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
      pickupWindow: data.pickupWindow || "Within 4 hours",
      location: data.location || "City Center",
      latitude: Number(data.latitude) || null,
      longitude: Number(data.longitude) || null,
      status: data.status || "Pending",
      donorId: donorIntId,
      donorName: data.donorName || "Anonymous Donor",
      donorPhone: data.donorPhone || "",
      claimedByNgoId: data.claimedByNgoId || null,
      claimedByNgoName: data.claimedByNgoName || null,
      volunteerName: data.volunteerName || null,
      volunteerPhone: data.volunteerPhone || null,
      estimatedPickupTime: data.estimatedPickupTime || null,
      otp,
      notes: data.notes || "",
      co2SavedKg:
        Number(data.co2SavedKg) ||
        (Number(data.mealCount) || 10) * 1.8,
      deliveredAt: null,
      createdAt: new Date().toISOString(),
    };

    if (isJsonStore()) {
      const db = readDb();
      db.donations.unshift(newDonation);
      writeDb(db);
    } else {
      const pool = getPool();
      await pool.query(
        `INSERT INTO donations (
          id, transactionId, foodName, category, dietaryType, quantity,
          mealCount, expiryDate, pickupWindow, location, latitude, longitude,
          status, donorId, donorName, donorPhone, otp, notes, co2SavedKg
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newDonation.id,
          newDonation.transactionId,
          newDonation.foodName,
          newDonation.category,
          newDonation.dietaryType,
          newDonation.quantity,
          newDonation.mealCount,
          newDonation.expiryDate,
          newDonation.pickupWindow,
          newDonation.location,
          newDonation.latitude,
          newDonation.longitude,
          newDonation.status,
          donorIntId,
          newDonation.donorName,
          newDonation.donorPhone,
          newDonation.otp,
          newDonation.notes,
          newDonation.co2SavedKg,
        ]
      );
    }

    return newDonation;
  },

  async findByIdAndUpdate(id, update, _options = {}) {
    if (isJsonStore()) {
      const db = readDb();
      const index = db.donations.findIndex(
        (d) => d._id === id || d.id === id
      );
      if (index === -1) return null;
      db.donations[index] = {
        ...db.donations[index],
        ...update,
        updatedAt: new Date().toISOString(),
      };
      writeDb(db);
      return db.donations[index];
    } else {
      const pool = getPool();
      const donation = await this.findById(id);
      if (!donation) return null;

      // Only update columns that actually exist in MySQL
      const validKeys = Object.keys(update).filter((k) => VALID_COLUMNS.has(k));
      if (validKeys.length > 0) {
        const setClauses = validKeys.map((k) => `\`${k}\` = ?`).join(", ");
        const values = [...validKeys.map((k) => update[k]), id];
        await pool.query(
          `UPDATE donations SET ${setClauses} WHERE id = ?`,
          values
        );
      }
      return this.findById(id);
    }
  },

  async countDocuments(query = {}) {
    if (isJsonStore()) {
      const db = readDb();
      if (Object.keys(query).length === 0) return db.donations.length;
      return db.donations.filter((d) => {
        for (const k of Object.keys(query)) {
          if (d[k] !== query[k]) return false;
        }
        return true;
      }).length;
    } else {
      const pool = getPool();
      const keys = Object.keys(query);
      if (keys.length === 0) {
        const [rows] = await pool.query(
          "SELECT COUNT(*) as count FROM donations"
        );
        return rows[0].count;
      }
      const where = keys.map((k) => `\`${k}\` = ?`).join(" AND ");
      const values = keys.map((k) => query[k]);
      const [rows] = await pool.query(
        `SELECT COUNT(*) as count FROM donations WHERE ${where}`,
        values
      );
      return rows[0].count;
    }
  },
};

module.exports = Donation;
