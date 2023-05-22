# Group 11 - Formula 1

### Folder structure

```
/                # Root directory.
|- docs/         # Milestones and other documentation. MILESTONE 4 LOCATED HERE.
|- src/          # All source files.
|- src/public/   # Our frontend to display f1 data and allow user to query.
|- src/server/   # Our backend express server for interacting with the database and handling queries.
```

### Steps to Run the Application

Note: The sql scripts used for this app are automatically loaded into our Azure Postgres SQL Server. As a user/TA, you do not need to worry about literally anything except just doing the steps below. 

1. Clone the project/repo into your desired folder
2. In command line, make sure you are in the correct folder (~./project_h7w2b_p3v2b_r4h0d)
3. run `npm install`
4. run `npm run start` for Mac/Linux, or `npm run startWin` for Windows
5. Wait until the server and database are initialized (should see comments in the terminal). This usually takes around 10 seconds.
6. A local page should automatically open up in your browser, and the app should be running!
7. If a page does not open for whatever reason, please navigate to http://localhost:1337/
