console.log("Content script running");

// Function to check if the current website is banned
const checkBannedWebsites = (bannedWebsites) => {
    const currentUrl = window.location.href;
    if (bannedWebsites.some(website => currentUrl.includes(website.url))) {
       
        console.log("Banned site detected");
        window.location.href = chrome.runtime.getURL('banned.html');
    }
};

// Function to fetch and check banned websites
const fetchAndCheckBannedWebsites = () => {
    chrome.storage.local.get('bannedWebsites', function(data) {
        const bannedWebsites = data.bannedWebsites || [];
        checkBannedWebsites(bannedWebsites);
    });
};

// Initial check for banned websites
fetchAndCheckBannedWebsites();

// Listen for changes in banned websites and update accordingly
chrome.storage.onChanged.addListener(function(changes, areaName) {
    
    if (areaName === 'local' && changes.bannedWebsites) {
        const bannedWebsites = changes.bannedWebsites.newValue || [];
        checkBannedWebsites(bannedWebsites);
    }
});
