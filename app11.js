//レポート用に作成した

const express = require("express");
const app = express();

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("test.db");

app.set("view engine", "ejs");
app.use("/public", express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// トップページ
app.get("/", (req, res) => {
  res.render("show2");
});

// バイク一覧
app.get("/bikes", (req, res) => {
  const sql = `
    SELECT bike.id, bike.name AS bike_name, 生産国, 発表日, 値段, maker.name AS maker_name
    FROM bike
    LEFT JOIN maker ON bike.maker_id = maker.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.log("バイク一覧取得エラー:", err);
      return res.render("show", { mes: "エラーが発生しました" });
    }
    res.render("bikes", { data: rows });
  });
});

// バイク詳細
app.get("/bike/:id", (req, res) => {
  const sql = `
    SELECT bike.*, maker.name AS maker_name
    FROM bike
    LEFT JOIN maker ON bike.maker_id = maker.id
    WHERE bike.id = ?
  `;
  db.get(sql, [req.params.id], (err, row) => {
    if (err || !row) {
      console.log("詳細取得エラー:", err);
      return res.render("show", { mes: "該当するバイクが見つかりません" });
    }
    res.render("bike_detail", { data: row });
  });
});

// POST: バイク追加
app.post("/insert-bike", (req, res) => {
  const { name, 生産国, 発表日, 値段, maker_id } = req.body;
  const sql = `INSERT INTO bike (name, 生産国, 発表日, 値段, maker_id) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [name, 生産国, 発表日, 値段, maker_id], function (err) {
    if (err) {
      console.log("バイク登録エラー:", err);
      return res.render("show", { mes: "バイク登録に失敗しました" });
    }
    res.render("show", { mes: `バイクを登録しました（ID: ${this.lastID}）` });
  });
});

// POST: メーカー追加
app.post("/insert-maker", (req, res) => {
  const { name, 国, 創業年月日 } = req.body;
  const sql = `INSERT INTO maker (name, 国, 創業年月日) VALUES (?, ?, ?)`;
  db.run(sql, [name, 国, 創業年月日], function (err) {
    if (err) {
      console.log("メーカー登録エラー:", err);
      return res.render("show", { mes: "メーカー登録に失敗しました" });
    }
    res.render("show", { mes: `メーカーを登録しました（ID: ${this.lastID}）` });
  });
});

// POST: チーム追加
app.post("/insert-team", (req, res) => {
  const { name, UCIランキング, 拠点 } = req.body;
  const sql = `INSERT INTO team (name, UCIランキング, 拠点) VALUES (?, ?, ?)`;
  db.run(sql, [name, UCIランキング, 拠点], function (err) {
    if (err) {
      console.log("チーム登録エラー:", err);
      return res.render("show", { mes: "チーム登録に失敗しました" });
    }
    res.render("show", { mes: `チームを登録しました（ID: ${this.lastID}）` });
  });
});

// メーカー一覧
app.get("/makers", (req, res) => {
  db.all("SELECT * FROM maker", [], (err, rows) => {
    if (err) return res.render("show", { mes: "メーカー取得に失敗しました" });
    res.render("makers", { data: rows });
  });
});

// チーム一覧
app.get("/teams", (req, res) => {
  db.all("SELECT * FROM team", [], (err, rows) => {
    if (err) return res.render("show", { mes: "チーム取得に失敗しました" });
    res.render("teams", { data: rows });
  });
});

// 契約関係表示
app.get("/relations", (req, res) => {
  const sql = `
    SELECT maker.name AS メーカー, team.name AS チーム
    FROM maker_team
    JOIN maker ON maker.id = maker_team.maker_id
    JOIN team ON team.id = maker_team.team_id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.render("show", { mes: "契約関係取得に失敗しました" });
    res.render("relations", { data: rows });
  });
});

// フォーム画面（静的HTML）
app.get("/form", (req, res) => {
  res.sendFile(__dirname + "/public/bike_form.html");
});
app.get("/form/maker", (req, res) => {
  res.sendFile(__dirname + "/public/maker_form.html");
});
app.get("/form/team", (req, res) => {
  res.sendFile(__dirname + "/public/team_form.html");
});

app.use(function(req, res, next) {
  res.status(404).send("ページが見つかりません");
});

app.listen(8080, () => console.log("サーバーが起動しました"));