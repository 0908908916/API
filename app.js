// 主要執行這個檔案 然後再去看網頁 http://localhost:3000/ (網址)
// 記得在創建 views 資料夾  一定要打對加 s 不然會有問題

const express = require("express");
const app = express();
const ejs = require("ejs");
const https = require("https"); // 導入 https 記得 不能用 http 要加 s

// 天氣 api key
const myKey = "c418a85ade31afc0e64116bb5d9faca1";

// h to cel 溫度函式
function ktoC(k) {
  return (k - 273.15).toFixed(2); // 改成小數點後兩位數
}

// middleware
app.use(express.static("public"));
app.set("view engine", "ejs");

// 創建一個首頁
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// 記得連到網站  https 一定要打 https 加 s 不然會有錯誤
// 導用天氣的 api 先到 Postman 將 URL 的網址貼上去 Get 把 city 跟 key 都複製貼到 Postman 之後 Send 就可看清楚資料是什麼哪些
// 使用這些資料來做虛擬網頁
app.get("/:city", (req, res) => {
  let { city } = req.params; // 放入物件 因為 params 是個 {}
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city},&appid=${myKey}`;

  // get request mode by node.js
  https
    .get(url, (response) => {
      console.log("statusCode:", response.statusCode); // 出現 200 的碼 就是沒問題 400 就是有問題
      console.log("headers:", response.headers); // 裡面有很多資訊

      response.on("data", (d) => {
        let djs = JSON.parse(d); // 這個 JSON 原本就是一個 async function 所以不用多加
        // 再來有了天氣的資訊 就來使用 weather.ejs 導裡面做設定
        let { temp } = djs.main; // 導入網站天氣
        let newTemp = ktoC(temp); // 把上面函式帶進來
        res.render("weather.ejs", { djs, newTemp }); // 在把新用的 newTeap 用進來
      });
    })
    .on("error", (e) => {
      console.log(e);
    });
});

// 在 node.js 這個 fetch 是不存在的喔
// 那如何解決這個問題 到網址 node.js https://nodejs.org/dist/latest-v20.x/docs/api/https.html
// 在文件-HTTPS-https.get(url[, options][, callback]) 這個可以使用 以下有方法教你使用

app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});
