Team Pointing App
A modern web application for agile team pointing sessions, built with React and Tailwind CSS.

Features
Multiple user roles:
Regular team members who vote on points
One observer who controls the session
Pointing workflow:
Start/stop pointing sessions
Hidden votes until revealed by the observer
Real-time voting status updates
Results visualization:
Vote distribution with bar charts
Average calculation
Individual vote display
Getting Started
Prerequisites
Node.js (v14 or newer)
npm or yarn
Installation
Clone the repository
git clone https://github.com/yourusername/pointing-app.git
cd pointing-app
Install dependencies
npm install
or

yarn install
Start the development server
npm start
or

yarn start
Open http://localhost:3000 in your browser
Usage
First person should join as an Observer by checking the "Join as Observer" checkbox
Team members join with their names
Observer clicks "Start Pointing" to begin a session
Team members select point values (0.5, 1, 2, 3, 5, 8, 13)
Observer can see real-time voting progress
When ready, Observer clicks "End & Reveal" to show all votes
Results are displayed with distribution and average
Building for Production
npm run build
or

yarn build
The build artifacts will be stored in the build/ directory.

Project Structure
pointing-app/
├── public/ # Static files
│ ├── index.html
│ └── favicon.ico
├── src/
│ ├── components/ # React components
│ │ ├── JoinForm.jsx
│ │ ├── ObserverControls.jsx
│ │ ├── ParticipantsList.jsx
│ │ ├── PointingCards.jsx
│ │ ├── ResultsView.jsx
│ │ └── StatusBar.jsx
│ ├── hooks/ # Custom React hooks
│ │ └── usePointingSession.js
│ ├── models/ # Type definitions
│ │ └── types.js
│ ├── styles/ # CSS styles
│ │ └── index.css
│ ├── App.jsx # Main application component
│ └── index.js # Application entry point
├── package.json
└── README.md
Future Enhancements
Custom point values
Timer functionality
User avatars
Session history
Export results
