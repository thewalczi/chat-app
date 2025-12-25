const http = require("http")
const {WebSocketServer} = require ("ws")
const fs = require("fs")
const path = require("path")

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, "dist", req.url === "/" ? "index.html" : req.url)

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404)
            res.end("Not found")
        } else {
            res.writeHead(200, {"Content-Type": "text/plain"})
            res.end(content)
        }
    })

})

const wss = new WebSocketServer({server})

wss.on("connection", (ws) => {
    console.log("Client Connected.")

    ws.on("message", (data) => {
        let message = JSON.parse(data)

        if(message.type === "message") {
            message = {
                ...message,
                timestamp: Date.now(),
            }
        }

        wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
                client.send(JSON.stringify(message))
            }
        })
    })

    ws.on("close", () => {
        console.log("Client disconnected")
        ws.send("Connection closed")
    })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})