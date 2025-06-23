//第９回でapp6.jsをコピーしたもの

const express = require("express");
const app = express();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test2.db'); // ← app9.jsのDBに変更

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

// 既存のルート
app.get("/", (req, res) => {
  const sql = `
    SELECT car.id, car.name, maker.name AS name2
    FROM car
    INNER JOIN maker ON car.maker_id = maker.id;
  `;

  db.all(sql, (error, rows) => {
    if (error) {
      console.log("DB Error:", error);
      res.status(500).send("データベースエラー");
      return;
    }

    res.render('show', { cars: rows });
  });
});

// ここに追加 第１０回
app.get("/db/:id", (req, res) => {
  db.serialize(() => {
    const sql = "select id, 都道府県, 人口, 大学 from example where id = ?";
    db.all(sql, [req.params.id], (error, row) => {
      if (error) {
        res.render('show', { mes: "エラーです" });
        return;
      }
      res.render('db', { data: row });
    });
  });
});

app.use(function(req, res, next) {
  res.status(404).send('ページが見つかりません');
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
