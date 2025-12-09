async function loadWeather() {
    try {
        const res = await fetch('/api/weather'); // Fetch weather data from the server
        const weather = await res.json(); // Parse the JSON response

        document.getElementById('weather').innerHTML =
        `   <h2> ${weather.name} </h2>
            <p>Temperature: ${weather.main.temp} °C</p>
            <p>Condition: ${weather.weather[0].description}</p>
        `
    } catch (err) {
        document.getElementById('weather').innerHTML = '<p>Failed to load weather data</p>' // innerHTML replaces the content of the element with id 'weather' in HTML (textContent would just add text, innerHTML can add HTML elements)
        console.log(err)
    }
}

async function loadChart() {
    try {
        const res = await fetch('/api/weather-log') // Fetch weather log data from the server
        const { timestamps, temps } = await res.json() // Parse the JSON response for the timestamps and temp arrays

        const trace ={
            x: timestamps,
            y: temps,
            type: 'scatter',
            mode: 'lines+markers',
            line: { color: 'purple' },
            marker: { size: 5 }
        }

        const layout = {
            title: 'Temperature Over Time',
            xaxis: { title: 'Date', type:  'data' },
            yaxis: { title: 'Temperature (°C)' },
            legend: { orientation: 'h', x: 0, y: 1.1 }
        }

        Plotly.newPlot('chart', [trace], layout) // Create a new plot in the element with id 'chart'
         } catch (err) {
        console.log('Failed to load chart', err);
         }

}

loadWeather(); // Call the function to load weather data when the page loads
loadChart(); // Call the function to load chart data when the page loads