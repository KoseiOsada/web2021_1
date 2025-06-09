const express = require("express");
const app = express();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test.db');

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  const message = "Hello world";
  res.render('show', {mes:message});
});

app.get("/db", (req, res) => {
    db.serialize( () => {
        db.all("select id, 都道府県, 人口 from example;", (error, row) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            res.render('select', {data:row});
        })
    })
})
app.get("/top", (req, res) => {
    //console.log(req.query.pop);  //1
    let desc = "";
    if( req.query.desc ) desc = " desc";
    let sql = "select id, 都道府県, 人口 from example order by 人口" + desc + " limit " + req.query.pop + ";";
    //console.log(sql);   //2
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('select', {data:data});
        })
    })
})

// 最大表示数のみ変更できる機能（昇順固定）
app.get("/top2", (req, res) => {
    //console.log(req.query.max);  //1
    let limit = parseInt(req.query.max);
    
  
    let sql = "SELECT id, 都道府県, 人口 FROM example ORDER BY 人口 ASC LIMIT ?";
   // console.log(sql);   //2
    db.all(sql, [limit], (error, data) => {
      if (error) {
        res.render('show', { mes: "エラーです" });
        return;
      }
      //onsole.log(data);    // ③
      res.render('select', { data: data });
    });
  });
  
  // 表示順のみ変更できる機能（全件表示）
  app.get("/sort2", (req, res) => {
    console.log(req.query.desc);  //1
    let order = req.query.desc === "1" ? "DESC" : "ASC";
    let sql = "SELECT id, 都道府県, 人口 FROM example ORDER BY 人口 " + order;
    console.log(sql);   //2
    db.all(sql, (error, data) => {
      if (error) {
        res.render('show', { mes: "エラーです" });
        return;
      }
      console.log(data);    // ③
      res.render('select', { data: data });
    });
  });

app.use(function(req, res, next) {
  res.status(404).send('ページが見つかりません');
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
