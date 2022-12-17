// app root

import express from "express"
import "./functions/database.js" // db connection
// routes
import users from "./routes/users/index.js"
import blogs from "./routes/blogs/index.js"

const PORT = process.env.PORT || 3000 // server port

const app = express()
app.use(express.static("./public")) // public folder open to the www
app.use(express.json()) // parses JSON payloads
app.use(express.urlencoded({ extended: true })) // parses urlencoded payloads

// routes
users(app)
blogs(app)

// all undefined routes, return 404
app.get("*", (req, res) => {
  res.sendStatus(404)
  res.end()
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})