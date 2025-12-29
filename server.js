const http = require("http")
const {WebSocketServer} = require ("ws")
const fs = require("fs")
const path = require("path")
const mime = require("mime-types")

const server = http.createServer((req, res) => {
  let filePath = path.join(
    __dirname,
    "dist",
    req.url === "/" ? "index.html" : req.url
  )

  const contentType = mime.lookup(filePath) || "application/octet-stream"

  fs.readFile(filePath, (err, content) => {
    if (err) {
      fs.readFile(path.join(__dirname, "dist", "index.html"), (err, html) => {
        res.writeHead(200, { "Content-Type": "text/html" })
        res.end(html)
      })
    } else {
      res.writeHead(200, { "Content-Type": contentType })
      res.end(content)
    }
  })
})

const wss = new WebSocketServer({server})

wss.on("connection", (ws) => {
    console.log("Client connected to instance:", process.pid)

    ws.on("message", (data) => {
        let message

        try {
          message = JSON.parse(data)
        } catch {
          alert('Connection is lost.')
        }

        if(message.type === "message") {
            message.imestamp = Date.now()
        }

        wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
                client.send(JSON.stringify(message))
            }
        })
    })

    ws.on("close", () => {
        console.log("Client disconnected")
    })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})