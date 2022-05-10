const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  console.log(req);

  if (url === "/") {
    res.write(`
        <html>
            <head>
                <title>Lab 2</title>
            </head>
            <body>
                <h1>Hello, Node!</h1>
                <a href="http://localhost:8000/read-message">READ MESSAGE</a>
                <a href="http://localhost:8000/write-message">WRITE MESSAGE</a>
            </body>
        </html>
      `);

    res.end();
  }

  if (url === "/write-message") {
    res.write(`
        <html>
            <head>
                <title>Write Message</title>
            </head>
            <body>
                <form action="/write-message" method="POST">
                    <input type="text" name="message" />
                    <button type="submit">Submit</button>
                </form>
            </body>
        </html>
      `);
    res.end();
  }

  if (url === "/write-message" && method === "POST") {
    const body = [];

    req.on("data", chunk => {
      body.push(chunk);
    });

    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      // console.log({ parsedBody });
      const message = parsedBody.split("=")[1];

      fs.writeFile("message.txt", message, err => {
        if (err) throw err;
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }

  if (url === "/read-message") {
    fs.readFile("./message.txt", (err, content) => {
      if (err) throw err;
      res.end(content, "utf8");
    });
  }
});

server.listen(8000, () => {
  console.log("Server is running");
});
