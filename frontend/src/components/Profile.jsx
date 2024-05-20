import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Chart from 'chart.js/auto';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await new Promise((resolve, reject) => {
                    chrome.storage.local.get('token', (data) => {
                        if (!data.token) {
                            reject('Token not found');
                        } else {
                            resolve(data.token);
                        }
                    });
                });

                const userInfoResponse = await fetch('https://tracker-g7k2.onrender.com/user_info', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!userInfoResponse.ok) {
                    throw new Error('Failed to fetch user info');
                }

                const userData = await userInfoResponse.json();
                setUserData(userData);

                const activitiesResponse = await fetch(`https://tracker-g7k2.onrender.com/users/${userData.id}/activities`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!activitiesResponse.ok) {
                    throw new Error('Failed to fetch activities data');
                }

                const activitiesData = await activitiesResponse.json();
                buildPieChart(activitiesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const buildPieChart = (data) => {
        const activityTimes = data.reduce((acc, activity) => {
            const activityType = activity.activity_type;
            const timeElapsed = parseTimeElapsed(activity.time_elapsed);
            acc[activityType] = (acc[activityType] || 0) + timeElapsed;
            return acc;
        }, {});

        const labels = Object.keys(activityTimes);
        const timeData = Object.values(activityTimes);

        const pieChartData = {
            labels: labels,
            datasets: [{
                data: timeData,
                backgroundColor: getRandomColors(labels.length),
            }],
        };

        setChartData(pieChartData);
    };

    const parseTimeElapsed = (timeElapsed) => {
        const match = timeElapsed.match(/^(\d+)(min)?$/);
        if (match) {
            const value = parseInt(match[1]);
            return isNaN(value) ? 0 : value;
        }
        return 0;
    };

    const getRandomColors = (count) => {
        const colors = [];
        for (let i = 0; i < count; i++) {
            colors.push(`rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.7)`);
        }
        return colors;
    };

    useEffect(() => {
        if (chartData.labels && chartData.labels.length > 0) {
            const ctx = document.getElementById('pie-chart');
            new Chart(ctx, {
                type: 'pie',
                data: chartData,
            });
        }
    }, [chartData]);

    return (
        <div>
            <Navbar />
            <h1>User Profile</h1>
            {/* Display user information if available */}
            {userData && (
                <div>
                    <p>Username: {userData.username}</p>
                    <p>Email: {userData.email}</p>
                </div>
            )}
            {/* Display pie chart */}
            <div>
                <h2>Activity Distribution</h2>
                <canvas id="pie-chart"></canvas>
            </div>
        </div>
    );
};

export default Profile;
