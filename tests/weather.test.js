import fs from 'fs';  
import path from 'path'; 

const DATA_DIR = path.join(process.cwd(), 'data')
const JSON_FILE = path.join(DATA_DIR, 'weather.json')
const CSV_FILE = path.join(DATA_DIR, 'weather_log.csv')

describe ('Weather Data Tests', () => {
    test ('weather.json file exists', () => {
        expect(fs.existsSync (JSON_FILE)).toBe(true);
    })
    test ('weather.json has required keys', () => {
        const raw = fs.readFileSync(JSON_FILE, 'utf8')
        expect(raw.trim().length).toBeGreaterThan(0) // Check file is not empty
        const data = JSON.parse(raw)
        expect(data).toHaveProperty('main')
        expect(data).toHaveProperty('weather')
        expect(data.weather[0]).toHaveProperty('description')
        expect(data).toHaveProperty('_last_updated_utc ')
        expect(new Date(data._last_updated_utc).toISOString()).toBe(data._last_updated_utc); // Check valid date
    })
    test ('CSV log exists and has header', () => {
        expect(fs.existsSync(CSV_FILE)).toBe(true)

        const csvContent = fs.readFileSync(CSV_FILE, 'utf8')
        const lines = csvContent.trim().split('\n') // Split file into lines
        const header = lines[0].split(',')  // Get header line and split into columns

        expect(header).toEqual(['timestamp', 'city', 'temperature', 'description']) // Check header columns
        expect(lines.length).toBeGreaterThan(1) // Check there's at least one data line
        
        const firstDataRow = lines[1].split(',')
        expect(!isNaN(parseFloat(firstDataRow[2]))).toBe(true) // Check temperature is a number
    })
});