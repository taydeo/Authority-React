# Authority: React Port
Realizing the limitations of PHP, and the advantages of moving to an React-Express framework (not to mention just moving to JavaScript entirely), I have opened this repository with the intentions on porting my political game. Anybody is allowed to commit, as long as they follow what CONTRIBUTING.md reads.

For a brief description of what Authority is (or, truthfully, I hope it to be):

> *Authority is an indev. political game in which users can register as a politician, run for offices, run countries, play a vital part in the economic system within their countries (and others), and seize power through a variety of methods; legal, or illegal.*

## Installation

 1. Clone the repository
	 1a. Make a fork if you plan to contribute.
 2. Install Node.js 
	 2a. Make sure to add it to your PATH if operating on Windows. 
 3. CD into the repository you cloned in Step 1.
 4. Run `npm install`in terminal/command prompt
 5. Wait for packages and dependencies to install.
 6. Look at env_example and make a copy of it.
	 6a. Rename it .env, replace any necessary values. **Most importantly, set up your SQL connection. Did I mention this is using SQL yet? No? Oops. Stay mad, Mongoists!**
 7. Set up SQL via scripts under `sql/`. It doesn't matter the order, but execute sql_schema.sql first.
 8. After setting up your .env file and SQL database, run `npm start`for production, and `npm run dev`for development. 
 9. There you go! Should work, and you should be all ready to develop (and commit plz I'm lonely)
