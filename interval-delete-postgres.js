require('dotenv').config();
const clerkClient = require('@clerk/clerk-sdk-node');
const cron = require('node-cron');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
})

pool.connect()
    .then(() => {
        console.log('connected to Postgres on port: 5432');
        deleteOldVisitors();
    })
    .catch((err) => {
        console.error('connection error', err.stack);
    })



async function deleteOldVisitors() {
    try {
        const clerk = clerkClient.createClerkClient({
            secretKey: process.env.CLERK_SECRET_KEY
        })
        const users = await clerk.users.getUserList();
        const userIds = users.data.filter(user => Object.keys(user.publicMetadata).length === 0)
        .map(user => user.id);
        console.log(userIds);
        
        for (i = 0; i < userIds.length; i++) {
            await clerk.users.deleteUser(userIds[i]);
        }
        
        const queryString = `DELETE FROM "ocm-visitors_visitors" WHERE user_id in (${userIds.map((id, index) => `'${id}'${index < userIds.length - 1 ? ',' : ''}`).join('')})`;
        pool.query(queryString, (err, res) => {
            if (err) {
                console.error(err.stack);
            } else {
                console.log(res.rows);
            }
        }
        
    );

    } catch (error) {
        console.log(error);
    }
}