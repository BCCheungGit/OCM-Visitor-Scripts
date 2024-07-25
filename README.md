# OCM-Visitor-Scripts
This is a repository to house the scripts for [OCM Visitor Registration](https://github.com/BCCheungGit/OCM-Visitor-Registration). 

## Interval Delete
The purpose of this script is to empty the database every single day, since visitors are temporary. 

To run the script:
1. ```npm install```
2. ```node interval-delete-postgres.js```
Make sure .env is set up with [vercel postgres](https://vercel.com) db keys and [clerk](https://clerk.dev) keys.