import fs from 'fs';  // File system module for reading files
import path from 'path'; // Path module for handling file paths
import dotenv from 'dotenv'; // Module to load environment variables

dotenv.config(); // Load environment variables from .env file


const DATA_DIR = path.join(import.meta.dirname, 'data'); // Directory where data files are stored
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR); // Create data directory if it doesn't exist
}

const WEATHER_FILE = path.join(DATA_DIR, 'weather.json'); // Path to the weather data file
const LOG_FILE = path.join(DATA_DIR, 'weather_log.csv'); // Path to the log file

export async function fetchWeather() {
    const apiKey = process.env.WEATHER_API_KEY; // Get API key from environment variables
    const city = process.env.CITY || 'London'; // Default city is London
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    
    try {
        const response = await fetch(url); // Fetch weather data from API

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json()  ; // Parse JSON response
        const nowUTC = new Date().toISOString(); // Current UTC time - creates timestamp (returns as string in ISO format)
       
        data._last_updated_utc = nowUTC; // Add timestamp to data
        fs.writeFileSync(WEATHER_FILE, JSON.stringify(data, null, 2)); // Save data to weather.json file. Null and 2 are for pretty-printing the JSON so we can read it.

        const header = 'timestamp,city,temperature,description\n' // CSV header
        if  (!fs.existsSync(LOG_FILE)) {
            fs.writeFileSync(LOG_FILE, header); // Create log file with header if it doesn't exist
        } else {
            const firstLine = fs.readFileSync(LOG_FILE, 'utf8').split('\n')[0]; // Read first line of log file. split('\n')[0] gets the first line.
            if (firstLine !== 'timestamp,city,temperature,description') {
                fs.writeFileSync(LOG_FILE, header + fs.readFileSync(LOG_FILE, 'utf8')); // Prepend header if missing
            }
        }

        const logEntry = `${nowUTC},${city},${data.main.temp},${data.weather[0].description}\n`; // Create log entry \n is new line
        fs.appendFileSync(LOG_FILE, logEntry); // Append log entry to log file

        console.log(`Weather data updated for ${city} at ${nowUTC}.`);
    } catch (err) {
        console.error('Error fetching weather:', err);
    }
}

  if (import.meta.url === `file://${process.argv[1]}`) { // Check if the script is run directly process.argv[1] is the path to the script being executed
        fetchWeather(); // If the script is run directly, execute fetchWeather. makes sure we have everything we need in the path before calling the function
}
 fetchWeather();
