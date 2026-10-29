const { readDb, writeDb, getPool, isJsonStore } = require("../config/db");

const User = {
  async findOne(query) {
    if (isJsonStore()) {
      const db = readDb();
      return (
        db.users.find((u) => {
          for (const key of Object.keys(query)) {
            if (u[key] !== query[key]) return false;
          }
          return true;
        }) || null
      );
    } else {
      const pool = getPool();
      const keys = Object.keys(query);
      if (keys.length === 0) return null;
      const where = keys
        .map((k) => `\`${k === "_id" ? "id" : k}\` = ?`)
        .join(" AND ");
      const values = keys.map((k) =>
        k === "_id" ? Number(query[k]) || query[k] : query[k]
      );
      const [rows] = await pool.query(
        `SELECT * FROM users WHERE ${where} LIMIT 1`,
        values
      );
      if (rows.length === 0) return null;
      const u = rows[0];
      return { ...u, _id: u.id };
    }
  },

  async findById(id) {
    return this.findOne({ _id: id });
  },

  find(query = {}) {
    const execute = async () => {
      let list = [];
      if (isJsonStore()) {
        const db = readDb();
        list = [...db.users];
        if (Object.keys(query).length > 0) {
          list = list.filter((u) => {
            for (const k of Object.keys(query)) {
              if (u[k] !== query[k]) return false;
            }
            return true;
          });
        }
      } else {
        const pool = getPool();
        const keys = Object.keys(query);
        let sql = "SELECT * FROM users";
        let values = [];
        if (keys.length > 0) {
          sql += " WHERE " + keys.map((k) => `\`${k}\` = ?`).join(" AND ");
          values = keys.map((k) => query[k]);
        }
        sql += " ORDER BY id DESC";
        const [rows] = await pool.query(sql, values);
        list = rows.map((u) => ({ ...u, _id: u.id }));
      }
      return list;
    };

    let excludePassword = false;

    return {
      select(fieldStr) {
        if (fieldStr && fieldStr.includes("-password")) {
          excludePassword = true;
        }
        return this;
      },
      async then(resolve, reject) {
        try {
          const list = await execute();
          if (excludePassword) {
            resolve(list.map(({ password, ...rest }) => rest));
          } else {
            resolve(list);
          }
        } catch (err) {
          if (reject) reject(err);
          else throw err;
        }
      },
    };
  },

  async create(userData) {
    if (isJsonStore()) {
      const id =
        userData._id ||
        "usr_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
      const newUser = {
        _id: id,
        id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || "",
        password: userData.password,
        role: userData.role || "donor",
        createdAt: new Date().toISOString(),
      };
      const db = readDb();
      db.users.push(newUser);
      writeDb(db);
      return newUser;
    } else {
      const pool = getPool();
      const [result] = await pool.query(
        "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)",
        [
          userData.name,
          userData.email,
          userData.phone || "",
          userData.password,
          userData.role || "donor",
        ]
      );
      const insertedId = result.insertId;
      return {
        _id: insertedId,
        id: insertedId,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || "",
        role: userData.role || "donor",
        createdAt: new Date().toISOString(),
      };
    }
  },

  async findByIdAndDelete(id) {
    if (isJsonStore()) {
      const db = readDb();
      const index = db.users.findIndex((u) => u._id === id || u.id === id);
      if (index === -1) return null;
      const [deleted] = db.users.splice(index, 1);
      writeDb(db);
      return deleted;
    } else {
      const pool = getPool();
      const numericId = Number(id) || id;
      const user = await this.findById(numericId);
      if (!user) return null;

      // Nullify FK references in donations before deleting user
      await pool.query(
        "UPDATE donations SET donorId = NULL WHERE donorId = ?",
        [numericId]
      );
      await pool.query("DELETE FROM users WHERE id = ?", [numericId]);
      return user;
    }
  },

  async countDocuments(query = {}) {
    if (isJsonStore()) {
      const db = readDb();
      if (Object.keys(query).length === 0) return db.users.length;
      return db.users.filter((u) => {
        for (const k of Object.keys(query)) {
          if (u[k] !== query[k]) return false;
        }
        return true;
      }).length;
    } else {
      const pool = getPool();
      const keys = Object.keys(query);
      if (keys.length === 0) {
        const [rows] = await pool.query(
          "SELECT COUNT(*) as count FROM users"
        );
        return rows[0].count;
      }
      const where = keys.map((k) => `\`${k}\` = ?`).join(" AND ");
      const values = keys.map((k) => query[k]);
      const [rows] = await pool.query(
        `SELECT COUNT(*) as count FROM users WHERE ${where}`,
        values
      );
      return rows[0].count;
    }
  },
};

module.exports = User;
