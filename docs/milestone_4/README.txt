================
The sql document within this folder is NOT the same as the one used within our project.
We (painstakingly) needed to change a bunch of stuff to make our postgres sql .sql files to work with the UBC oracle database.
We only made it work for grading purposes, as it was stated that the file must be able to run on the oracle database.
But the TA's will not need to run this, nor should they use it for grading.

The init_tables.sql and init_tuples.sql files (located within src/server/src/db) will automatically run and initialize our database hosted on azure. These are the files that are used for our project.


CHANGES MADE TO POSTGRES SQL FILES TO MAKE THEM WORK WITH UBC CPSC ORACLE:

removed all ON UPDATE CASCADE since oracle doesn't support on update
changed all ON DELETE RESTRICT to ON DELETE CASCADE since oracle doesn't support on delete restrict
changed some names due to oracle built-in functions/types conflicting
changed the way we drop tabls to fit oracle's methods
changed the default oracle DATE format to fit our data's format
changed TIME to VARCHAR due to time formatting problems in data
===============

### Steps to Run the Application

Note: The sql scripts used for this app are automatically loaded into our Azure Postgres SQL Server. As a user/TA, you do not need to worry about literally anything except just doing the steps below.

1. Clone the project/repo into your desired folder
2. In command line, make sure you are in the correct folder (~./project_h7w2b_p3v2b_r4h0d)
3. run `npm install`
4. run `npm run start` for Mac/Linux, or `npm run startWin` for Windows
5. Wait until the server and database are initialized (should see comments in the terminal). This usually takes around 10 seconds.
6. A local page should automatically open up in your browser, and the app should be running!
7. If a page does not open for whatever reason, please navigate to http://localhost:1337/
