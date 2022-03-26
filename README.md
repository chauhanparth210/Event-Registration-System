# Event Registration System

This web app  is created with the help of MERN Stack. Basically it manage the mailing and registration system.

## Main Technologies
### Frontend side :
- React.js (frontend library for build use experience) + Hooks
- Context API (State management)
- React hooks form (handling forms)
### Backend side :
- Node.js/Express.js (API)
- MongoDB (Database for storing the use information)
- Crypto-js (end to end encryption)
- Node-mailer (sending emails)
- Joi (object validator)
- Passport.js (handling admin functionality)
- Helmet.js (sanitize the API and preventing from various attacks)


## Quick Start

Create `.env` file at root folder and provide environment variables

```bash
# Gmail and Password
GMAIL=
GMAIL_PASSWORD=
# Secret key(same as client SECRET)
SECRET=
# Website Login page
WEBAPP_URL=
# Mongodb database string
MONGO_DB=
PORT=
```

On Client folder under ```src\config``` folder provide environment variables

### Installation step
``` bash
# Install dependencies for server
yarn install

# Install dependencies for client
yarn client-install

# Run the client & server with concurrently
yarn dev

# Run the Express server only
yarn server

# Run the React client only
yarn client

# Server runs on http://localhost:5000 and client on http://localhost:3000
```

### Author

[Parth Chauhan](https://github.com/chauhanparth210)

### Version

1.0.0

### License

This project is licensed under the MIT License
