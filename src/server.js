const express = require("express")
const path = require("path")

const connectDB = require("../config/connectDB")

const app = express()

connectDB()

app.use(express.json())

app.use("/api/search", require("./routes/search"))
app.use("/api/vote", require("./routes/vote"))

if (process.env.NODE_ENV === "production") {
  app.use(express.static("app/build"))
  app.get("*", (_req, res) =>
    res.sendFile(path.resolve(__dirname, "app", "build", "index.html")),
  )
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
