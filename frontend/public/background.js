console.log("Background script running");
let activeTabInfo = {};

// // Update blocked sites function
// async function updateBlockedSites() {
//     try {
//         const { bannedWebsites } = await chrome.storage.local.get('bannedWebsites');
//         console.log('Blocked sites:', bannedWebsites);
        
//         // Loop through the banned websites to manipulate the DOM
//         (bannedWebsites || []).forEach(website => {
//             // Check if the website is currently open in any tabs
//             chrome.tabs.query({ url: website.url }, tabs => {
//                 tabs.forEach(tab => {
//                     // Execute a content script to manipulate the DOM of the blocked website
//                     chrome.tabs.executeScript(tab.id, {
//                         code: `
//                             // Your DOM manipulation code here
//                             // For example, change the background color of the page
//                             document.body.style.backgroundColor = 'red';
//                             // Or display a message
//                             document.body.innerHTML = '<h1>This website is blocked!</h1>';
//                         `
//                     });
//                 });
//             });
//         });

//         console.log('DOM manipulation executed successfully.');
//     } catch (error) {
//         console.error('Error updating blocked sites:', error);
//     }
// }

// // Initialize blocked sites on install and startup
// chrome.runtime.onInstalled.addListener(updateBlockedSites);
// chrome.runtime.onStartup.addListener(updateBlockedSites);

// // Update blocked sites on storage change
// chrome.storage.onChanged.addListener((changes, area) => {
//     if (area === 'local' && changes.bannedWebsites) {
//         updateBlockedSites();
//     }
// });


// // Initialize blocked sites on install and startup
// chrome.runtime.onInstalled.addListener(updateBlockedSites);
// chrome.runtime.onStartup.addListener(updateBlockedSites);

// // Update blocked sites on storage change
// chrome.storage.onChanged.addListener((changes, area) => {
   
//         updateBlockedSites();
    
// });

// Listen for tab activation
chrome.tabs.onActivated.addListener(activeInfo => {
    const { tabId, windowId } = activeInfo;
    if (activeTabInfo[windowId] && activeTabInfo[windowId].tabId) {
        sendDataToServer(activeTabInfo[windowId], "tabswitch");
    }

    chrome.tabs.get(tabId, tab => {
        if (!chrome.runtime.lastError && tab) {
            activeTabInfo[windowId] = {
                tabId: tab.id,
                url: tab.url,
                startTime: Date.now(),
            };
        } else {
            console.error(
                "Error getting tab:",
                chrome.runtime.lastError
                    ? chrome.runtime.lastError.message
                    : "Tab not found"
            );
        }
    });
});

// Listen for tab removal
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    const { windowId } = removeInfo;

    let motive = "tabclose";
    if (activeTabInfo[windowId] && activeTabInfo[windowId].tabId === tabId) {
        if (activeTabInfo[windowId].url) {
            sendDataToServer(activeTabInfo[windowId], motive);
        }
        delete activeTabInfo[windowId];
    }
});

// Function to send data to the server
function sendDataToServer(tabInfo, motive) {
    const { url, startTime } = tabInfo;
    if (url === '' || url.startsWith('chrome://') || url === null) {
        console.error('Skipping data send to server for internal pages or null URL.');
        return;
    }
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const serverURL = "https://tracker-g7k2.onrender.com/activities/track"; // Replace with your server endpoint

    chrome.storage.local.get("token", (data) => {
        const token = data.token;
        if (!token) {
            console.error('Token not found in Chrome storage. Skipping data send to server. Ensure you are logged in.');
            return;
        }

        const activity = {
            website_url: url,
            activity_type: "visit",
            start_time: new Date(startTime).toISOString(),
            time_elapsed: (Math.round(totalTime/10)/100) + "sec",
        };

        fetch(serverURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ activity }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Data sent to server:', activity);
        })
        .catch(error => console.error('Error sending data to server:', error));
    });
}
