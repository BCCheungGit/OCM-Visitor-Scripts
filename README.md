# OCM-Visitor-Scripts
This is a repository to house the scripts for [OCM Visitor Registration Clerk/Vercel](https://github.com/BCCheungGit/OCM-Visitor-Registration) and also for [OCM Visitor Registration Supabase/Twilio](https://github.com/BCCheungGit/OCM-Visitors-Supabase)

## Interval Delete
The purpose of this script is to empty the database every Sunday at 00:00 (12:00 AM), since visitors are temporary and will not be stored in the main database.

To run the script:
1. ```npm install```
2. ```node interval-delete-postgres.js```
or
2. ```node interval-delete-supabase.js```

Make sure .env is set up with [vercel postgres](https://vercel.com) db keys and [clerk](https://clerk.dev) keys if you are running the scripts for the vercel/clerk version, or with [supabase](https://supabase.com/) keys if you are running the scripts for the supabase/twilio version.