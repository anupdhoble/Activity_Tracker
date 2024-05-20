import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
    const [activities, setActivities] = useState([]);
    const [showAll, setShowAll] = useState(false); 
    const [bannedWebsites, setBannedWebsites] = useState([]); 
    const [newBannedWebsite, setNewBannedWebsite] = useState(''); 
    const navigate = useNavigate();

    useEffect(() => {
       
        const fetchActivities = async () => {
            try {
                const tokenData = await new Promise((resolve, reject) => {
                    chrome.storage.local.get('token', (data) => {
                        if (!data.token) {
                            reject('Token not found');
                        } else {
                            resolve(data.token);
                        }
                    });
                });

                const userinfoResponse = await fetch('https://tracker-g7k2.onrender.com/user_info', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${tokenData}`
                    }
                });

                if (!userinfoResponse.ok) {
                    throw new Error('Failed to fetch user info');
                }

                const userinfo = await userinfoResponse.json();

                const activitiesResponse = await fetch(`https://tracker-g7k2.onrender.com/users/${userinfo.id}/activities`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${tokenData}`
                    }
                });

                if (!activitiesResponse.ok) {
                    throw new Error('Failed to fetch activities');
                }

                const activitiesData = await activitiesResponse.json();
                setActivities(activitiesData);
            } catch (error) {
                console.error('Error fetching activities:', error);
                // Redirect to login page if token is not valid or expired
                navigate('/login');
            }
        };

        fetchActivities();
    }, [navigate]);

   
    const fetchBannedWebsites = async () => {
        try {
            const tokenData = await new Promise((resolve, reject) => {
                chrome.storage.local.get('token', (data) => {
                    if (!data.token) {
                        reject('Token not found');
                    } else {
                        resolve(data.token);
                    }
                });
            });

           

            const bannedWebsitesResponse = await fetch(`https://tracker-g7k2.onrender.com/banned_websites`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${tokenData}`
                }
            });

            if (!bannedWebsitesResponse.ok) {
                throw new Error('Failed to fetch banned websites');
            }

            const bannedWebsitesData = await bannedWebsitesResponse.json();
            setBannedWebsites(bannedWebsitesData);
            chrome.storage.local.set({ bannedWebsites: bannedWebsitesData });
            console.log('HomeScreen.jsx Line 151: Banned websites:', await chrome.storage.local.get('bannedWebsites'));
        } catch (error) {
            console.error('Error fetching banned websites:', error);
        }
    };
    const handleDeleteBannedWebsite = async (id) => {
        try {
            const tokenData = await new Promise((resolve, reject) => {
                chrome.storage.local.get('token', (data) => {
                    if (!data.token) {
                        reject('Token not found');
                    } else {
                        resolve(data.token);
                    }
                });
            });

          
            const response = await fetch(`https://tracker-g7k2.onrender.com/banned_websites/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${tokenData}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete banned website');
            }
            fetchBannedWebsites();
            
            chrome.runtime.sendMessage({ type: 'updateBannedWebsites', bannedWebsites: bannedWebsites });
            console.log('Banned website deleted:', id);
        } catch (error) {
            console.error('Error deleting banned website:', error);
        }
    };

    // Function to toggle the showAll state
    const handleShowMore = () => {
        setShowAll(!showAll);
    };

    

    // Function to handle input change for adding a new banned website
    const handleNewBannedWebsiteChange = (event) => {
        setNewBannedWebsite(event.target.value);
    };

    const handleAddBannedWebsite = async () => {
        try {
            const tokenData = await new Promise((resolve, reject) => {
                chrome.storage.local.get('token', (data) => {
                    if (!data.token) {
                        reject('Token not found');
                    } else {
                        resolve(data.token);
                    }
                });
            });

          

            const response = await fetch(`https://tracker-g7k2.onrender.com/banned_websites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenData}`
                },
                body: JSON.stringify({ url: newBannedWebsite })
            });

            if (!response.ok) {
                throw new Error('Failed to add banned website');
            } else {
                setNewBannedWebsite('');
            }

            // Fetch updated banned websites list after adding the new website
            fetchBannedWebsites();
        } catch (error) {
            console.error('Error adding banned website:', error);
        }
    };

    return (
        <div className="home-screen">
            {/* Navigation bar */}
            <nav className="navbar">
                <Navbar />
                <h2>Activity Tracker</h2>
                
            </nav>
            {/* Button to fetch and show banned websites */}
            <div className="show-banned-websites">
                <button onClick={fetchBannedWebsites}>Show Banned Websites</button>
                {bannedWebsites.length > 0 && (
                    <ul>
                        {bannedWebsites.map((website, index) => (
                            <li key={index}>
                                {website.url}
                                {/* Cross button to delete the website */}
                                <button onClick={() => handleDeleteBannedWebsite(website.id)}>X</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>


            {/* Input field and button to add a new banned website */}
            <div className="add-banned-website">
                <input
                    type="text"
                    value={newBannedWebsite}
                    onChange={handleNewBannedWebsiteChange}
                    placeholder="Enter URL to ban"
                />
                <button onClick={handleAddBannedWebsite}>Add</button>
            </div>


            {/* Activities list */}
            <div className="activities-list">
                <h3>Recent Activities</h3>
                <ul>
                    {showAll
                        ? activities.map(activity => (
                            <li key={activity.id}>
                                <div>
                                    <strong>Website:</strong> {activity.website_url}
                                </div>
                                <div>
                                    <strong>Time Spent:</strong> {activity.time_elapsed}
                                </div>
                                <div>
                                    <strong>Category:</strong> {activity.activity_type}
                                </div>
                            </li>
                        ))
                        : activities.slice(0, 5).map(activity => (
                            <li key={activity.id}>
                                <div>
                                    <strong>Website:</strong> {activity.website_url}
                                </div>
                                <div>
                                    <strong>Time Spent:</strong> {activity.time_elapsed}
                                </div>
                                <div>
                                    <strong>Category:</strong> {activity.activity_type}
                                </div>
                                <div>
                                    <strong>Visited Time:</strong> {activity.start_time}
                                </div>
                            </li>
                        ))
                    }
                </ul>
                {/* Show More/Less button */}
                {activities.length > 5 && (
                    <button onClick={handleShowMore}>
                        {showAll ? 'Show Less' : 'Show More'}
                    </button>
                )}
            </div>


        </div>
    );
};

export default HomeScreen;
