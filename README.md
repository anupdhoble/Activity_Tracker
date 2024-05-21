**Activity Tracker Chrome Extension Documentation**

---
## Note
- Ruby on rails backend is a subdirectory of this repository you can click on Ruby on Rails folder or directlly visit here -> https://github.com/anupdhoble/tracker
- Backend is currently deployed on render , can check health of server on -> https://tracker-g7k2.onrender.com/health
- Backend is deployed on render freee instance which tends to spindown incase of inactivity , if app request not working , give 1 minute to spin the render backend back up again.
- Database is SQLite and not seperately deployed from backend and is inbuild in render deployment.
## Overview

The Activity Tracker Chrome Extension allows users to monitor their browsing activity by tracking the time spent on different webpages. This documentation provides detailed instructions on how to install and use the extension, along with screenshots for clarity. Additionally, the database schema for the Rails API backend is provided.

### Screenshots

![image](https://github.com/anupdhoble/Activity_Tracker/assets/83175840/a525b01d-3093-4890-bb0d-350b63592693)


*Figure 1: HomePage
## Installation

1. **Clone the Repository:** 
   ```
   git clone https://github.com/yourusername/activity-tracker.git
   ```
   - Go to frontend folder
   - Type `npm install` to install all node packages
   - Type `npm run build` to make build ready for extension

2. **Load Extension in Chrome:**
   - Open Google Chrome.
   - Go to `chrome://extensions/`.
   - Enable "Developer mode" in the top right corner.
   - Click on "Load unpacked" and select the `dist` folder from frontend directory from the cloned repository.
## Intallation and working Video guide
Video : https://youtu.be/ikAM3H4LQ4E

## Usage

1. **Start Tracking:**
   - Click on the extension icon in the Chrome toolbar to open the popup interface (refer to Figure 1).
   - Signup with a demo username, email id and password.
   - Login to start tracking 

2. **Stop Tracking:**
   - To stop tracking, Click on Logout and all changes will be saved and tracking will stop

3. **Banned Websites**
   - Click on See banned websites that you have banned
   - You can add new websites to this list , and that site will be blocked from your browser
   - To remove from this banned sites list , click on `X` mark in front of website
## Database Schema

Below is the database schema for the Rails API backend:

```
users:
- id (integer)
- email (string)
- password_digest (string)
- created_at (datetime)
- updated_at (datetime)

activities:
- id (integer)
- user_id (integer)
- website_url (string)
- activity_type (string)
- start_time (datetime)
- time_elapsed (string)
- created_at (datetime)
- updated_at (datetime)

banned_websites:
- id(integer)
- url(string)
- created_at (datetime)
- updated_at (datetime)
- userid (integer)
```
## Routes
### Banned_websites
- `GET /banned_websites` to get all banned websites for user
- `POST /banned_websites` to add website name in banned websites list
- `DELETE /banned_websites/:id` to delete a website name from list
  
### User
- `POST /users` signup
- `POST /login` login
- `GET /user_info` To get user info from token
- 
### Activites
- `GET /users/:id/activites` To get activites of a particular user
- `POST /activities/track` To add activity of particular user
  
Note : At token is passed as authorization in header when required
Can view all APIs here -> https://api.postman.com/collections/26633925-a29b776b-da00-40ca-8823-ceee6c3824c5?access_key=PMAT-01HYBWRDEDMD9M6RMP3WGQ2C47


---
