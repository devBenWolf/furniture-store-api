require(`dotenv`).config()
const express = require(`express`)
const app = express()
const notFoundMiddleware = require(`./middleware/not-found.js`)
const errorMiddleware = require(`./middleware/error-handler.js`)


// middleware
app.use(express.json())

// routes
app.get(`/`, (req, res) => {
    res.send(`<h1>Store API</h1><a href = "/api/v1/products">Link to products</a>`)
})

// products route
app.use(notFoundMiddleware)
app.use(errorMiddleware)

const port = process.env.PORT || 3000

const start = async() => {
    try {
        // connectDB
        app.listen(port)
        console.log(`Server listening on port ${port}...`)
    } catch (error) {
        console.log(error)
    }
}

start()