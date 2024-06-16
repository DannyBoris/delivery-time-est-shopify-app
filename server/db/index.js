// init sql db
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

function init() {
  db.serialize(() => {
    // create area table with id, name (alpha2) and estimated time is 2 values (x between y)
    db.run(`CREATE TABLE areas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            estimated_time TEXT NOT NULL
        )`);
    // add some data
    db.run(`INSERT INTO areas (name, estimated_time) VALUES ('US', '3-5')`);
    db.run(`INSERT INTO areas (name, estimated_time) VALUES ('CA', '4-6')`);
    db.run(`INSERT INTO areas (name, estimated_time) VALUES ('MX', '5-7')`);
    db.run(`INSERT INTO areas (name, estimated_time) VALUES ('BR', '6-8')`);
    // create user table with id and name
  });
  console.log("db initialized");
  return db;
}

function addArea(area, estimatedTime) {
  db.run(
    `INSERT INTO areas (name, estimated_time) VALUES ('${area}', '${estimatedTime}')`
  );
}

function getAllAreas() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM areas", (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

function saveAreas(areas) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM areas", (err) => {
      if (err) {
        reject(err);
      }
      areas.forEach((area) => {
        db.run(
          `INSERT INTO areas (name, estimated_time) VALUES ('${area.name}', '${area.estimated_time}')`
        );
      });
      console.log("areas saved");
      resolve();
    });
  });
}

module.exports = { init, addArea, getAllAreas, saveAreas };
