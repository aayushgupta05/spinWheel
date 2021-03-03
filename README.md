# Spin Wheel (Assignment)
Application to spin a prize-wheel (once for each render to avoid redundant spins) depending on which the user will get a prize (data for which will be automatically uploaded to Google Sheets).

##  Setting up the Project
(Make sure you have NodeJS and NPM/YARN installed on your machine)
1. Fork this repository
2. Clone the forked repository on your local machine using: 
`git clone https://github.com/<username>/spinWheel.git`. (Replace username with your own username)
3. Install all the dependencies using `yarn install`.
4. Create a copy of `example.env` and rename it to `.env`. Then create a Google Sheets API key and fill in details inside `.env` file.
5. Finally start the application using `yarn start`.

## Features Implemented
- Design implemented similar to the given prototype except the power of rotation UI component (+ takes a mobile-sized container in the middle if opened on desktop/tablet)
- Implemented swipe down to refresh anywhere on the screen (for mouse events)
- Handled loading and error states
- Code structured properly into pages and UI components
- Result data uploaded to Google Sheet (link sent in email)
- Code deployed to a heroku instance (please refresh the page in case of error if you are accessing the application between 12am to 7am IST since Heroku pushes in into inactive state for that period  (for the rest time, I have set up a cron-job which keeps it active by sending dummy request) and the first request timeouts in that period before the instance is brought up into active state, server is successfully run and connected to Google Sheets API
- Rotate the wheel anti-clockwise and increase the power of rotation which is visible in the arrow below the wheel and once you leave it after it crosses the black mark, it rotates with higher power clockwise.
