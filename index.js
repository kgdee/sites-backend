import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import path from 'path';
import { fileURLToPath } from 'url'
import favicon from 'serve-favicon'

import App from './models/App.js'

dotenv.config({ path: '.env.local' })
mongoose.set("strictQuery", false);
const app = express()
const port = 5000
app.use(express.json())
app.use(cors());
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))


const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
  } catch (error) {
    console.error(error);
  }
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Create app
app.post('/', async (req, res) => {
  try {
    const newApp = new App(req.body)

    const savedApp = await newApp.save()

    res.status(200).json(savedApp)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

// Update app
app.put('/:id', async (req, res) => {
  try {
    const updatedApp = await App.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })

    res.status(200).json(updatedApp)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

// Delete app
app.delete('/:id', async (req, res) => {
  try {
    await App.findByIdAndDelete(req.params.id)

    res.status(200).json("App has been deleted.")
  } catch (error) {
    res.status(500).json(error.message)
  }
})

// Get app
app.get('/:id', async (req, res) => {
  try {
    const app = await App.findById(req.params.id)

    res.status(200).json(app)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

// Get apps
app.get('/', async (req, res) => {
  try {
    const { name = "", limit = 25 } = req.query

    const apps = await App.find({ name: new RegExp(name, 'i') }).limit(limit)

    res.status(200).json(apps)
  } catch (error) {
    res.status(500).json(error.message)
  }
})


app.listen(port, () => {
  connect()
  console.log(`Server is running on http://localhost:${port}`)
})