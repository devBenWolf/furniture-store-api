require(`dotenv`).config()

const connectDB = require(`./db/connect`)
const Product = require(`./models/product`)

// data array to populate the DB
const jsonProducts = require(`./products.json`)

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URI)
        await Product.deleteMany()
        await Product.create(jsonProducts)
        // end process upon success
        process.exit(0)
    } catch (error) {
        console.log(error)
        // end process upon failure
        process.exit(1)
    }
}

start()