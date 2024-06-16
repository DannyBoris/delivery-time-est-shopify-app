const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const port = 3000;
db.init();
app.use(cors());
app.use(express.json());

app.post("/new_area", (req, res) => {
  // get users
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      res.status(500).send("Internal server error");
      return;
    }
    res.json(rows);
  });
});

app.get("/areas", async (req, res) => {
  const areas = await db.getAllAreas();
  res.json(areas);
});

app.post("/save_areas", async (req, res) => {
  const { areas } = req.body;
  console.log(areas);
  await db.saveAreas(areas);
  res.send("ok");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
