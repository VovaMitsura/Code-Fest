#!bin/bash

# Start backend
cd server
npm install
npm run dev &
cd ../react-app
npm install
npm run dev &