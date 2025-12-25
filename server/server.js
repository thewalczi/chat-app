const http = require("http")
const {WebSocketServer} = require ("ws")

const server = http.createServer((req, res) => {
    res.writeHead(200, {"Content-Type": "text/plain"})
    res.end("Hello from node.js")
})

const wss = new WebSocketServer({server})

wss.on("connection", (ws) => {
    console.log("Client Connected.")

    // ws.send("Welcome to WebSocket Server!")

    ws.on("message", (data) => {
        let message = JSON.parse(data)

        if(message.type === "message") {
            message = {
                ...message,
                timestamp: Date.now(),
            }
        }
        // ws.send(`Server echo : ${message}`)
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

    // ws.on("error", (error) => {
    //     ws.send(`Error: ${error}`)
    // })
})


server.listen(3000, () => {
    console.log("Server is running at http://localhost:3000")
})