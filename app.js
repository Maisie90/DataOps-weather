import express from 'express'; // Importing the Express framework
import fs from 'fs'; // File system module for reading files
import path from 'path'; // Path module for handling file paths
import csv from 'csv-parser'; // CSV parser module for reading CSV files
import dotenv from 'dotenv'; // Module to load environment variables

dotenv.config(); // Load environment variables from .env file

const app = express(); // Create an Express application

const PORT = process.env.PORT || 5000 // Define the port to run the server on

const DATA_DIR = path.join(import.meta.dirname, 'data'); // Directory where data files are stored
const WEATHER_FILE = path.join(DATA_DIR, 'weather.json'); // Path to the weather data file
const LOG_FILE = path.join(DATA_DIR, 'weather_log.csv'); // Path to the log file
 // fetchweather and app.js will run independently so we need to redefine these paths here ^

app.use(express.static(path.join(import.meta.dirname, 'public'))); // Serve static files from the 'public' directory (like html and css files). Makes front end work with express server

app.get('/api/weather', (req, res) => {
    if (!fs.existsSync(WEATHER_FILE)) {
        return res.status(404).json({ error: 'No weather data available' }); // If weather file doesn't exist, return 404
    }

    try {
        const weatherData = JSON.parse(fs.readFileSync(WEATHER_FILE, 'utf8')); // Read and parse weather data from file to json object
        res.json(weatherData); // Send weather data as JSON response to the browser
    } catch (err) {
        console.log('Error reading weather.json', err);
        res.status(500).json({ error: 'Failed to read weather data' }); // If there's an error reading the file, return http status 500 to browser
    }})

app.get('/api/weather-log', (req, res) => {
    if (!fs.existsSync(LOG_FILE)) { 
        return res.status(404).json({ error: 'No weather log available' }); // If log file doesn't exist, return 404
    }

    const timestamps = []
    const temps = []

    fs.createReadStream(LOG_FILE) // Create a readable stream from the log file
        .pipe(csv()) // Pipe the stream through the CSV parser
        .on('data', (row) => {
            if (row.timestamp && row.temperature) { // Check if the required fields exist
                timestamps.push(row.timestamp); // Add timestamp to array
                temps.push(parseFloat(row.temperature)); // Add temperature to array (convert to float)
            }
        })
        .on ('end', () => res.json({ timestamps, temps })) // When done, send the data as JSON response
        .on('error', err => {
            console.log('Error reading csv', err);
            res.status(500).json({ error: 'Failed to read log' }); // If there's an error reading the file, return http status 500 to browser
        });
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`); // Log the server URL when it starts
});