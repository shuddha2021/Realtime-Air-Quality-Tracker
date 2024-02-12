import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [cityAQIs, setCityAQIs] = useState([]);

    const allCities = [
        "Los Angeles", "New York", "London", "Delhi", "Beijing", "Tokyo", "Sydney", "Sao Paulo", "Moscow", "Paris",
        "Seoul", "Cairo", "Bangkok", "Mexico City", "Jakarta", "Lima", "Buenos Aires", "Istanbul", "Mumbai", "Lagos",
        "Toronto", "Chicago", "Hong Kong", "Madrid", "Dubai", "Rome", "Bangalore", "Shanghai", "Karachi", "Manila"
    ];

    // Select 20 random cities from the list
    const cities = allCities.sort(() => 0.5 - Math.random()).slice(0, 20);

    useEffect(() => {
        const apiKey = "e221525b617eb7bca827d1258c4c0e57b32e4fb1";
        const fetchAQIData = async () => {
            const requests = cities.map(city =>
                axios.get(`https://api.waqi.info/feed/${encodeURIComponent(city)}/?token=${apiKey}`)
            );
            try {
                const responses = await Promise.all(requests);
                const data = responses.map((response, index) => ({
                    city: cities[index],
                    aqi: response.data.data.aqi,
                    color: getAQIColor(response.data.data.aqi),
                    scale: getAQIScale(response.data.data.aqi)
                }));
                setCityAQIs(data);
            } catch (error) {
                console.error('Error fetching air quality data:', error);
            }
        };

        fetchAQIData();
    }, []);

    const getAQIColor = (aqi) => {
        if (aqi <= 50) return '#0C0';
        else if (aqi <= 100) return '#FFD700'; // Changed to gold for better visibility
        else if (aqi <= 150) return '#F90';
        else if (aqi <= 200) return '#F00';
        else if (aqi <= 300) return '#A0F';
        else return '#A00';
    };

    const getAQIScale = (aqi) => {
        const scale = Math.min(100, (aqi / 300) * 100); // Normalize AQI to 100 for simplicity
        return `${scale.toFixed(0)}%`;
    };

    return (
        <div style={{ fontFamily: 'Arial', padding: '20px' }}>
            <h1>Air Pollution Tracker</h1>
            <ul>
                {cityAQIs.map((city, index) => (
                    <li key={index} style={{ margin: '10px 0', display: 'flex', alignItems: 'center', listStyleType: 'none' }}>
                        <span style={{ fontWeight: 'bold', marginRight: '10px', flexShrink: 0 }}>{city.city}:</span>
                        <span style={{ color: city.color, marginRight: '10px' }}>AQI {city.aqi}</span>
                        <div style={{ background: '#ddd', width: '100px', height: '10px', borderRadius: '5px', overflow: 'hidden', marginRight: '10px' }}>
                            <div style={{ background: city.color, width: city.scale, height: '100%' }}></div>
                        </div>
                        <span style={{ flexShrink: 0 }}>{city.scale}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
