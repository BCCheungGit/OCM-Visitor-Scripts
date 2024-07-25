require('dotenv').config();
const clerkClient = require('@clerk/clerk-sdk-node');
const cron = require('node-cron');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
})


async function deleteOldVisitors() {
    try {
        const clerk = clerkClient.createClerkClient({
            secretKey: process.env.CLERK_SECRET_KEY
        })
        const users = await clerk.users.getUserList();
        const userIds = users.data.filter(user => Object.keys(user.publicMetadata).length === 0).map(user => user.id);
        console.log(userIds);
        
        for (i = 0; i < userIds.length; i++) {
            await clerk.users.deleteUser(userIds[i]);
            console.log(`Deleted user with id: ${userIds[i]}`);
        }
        
        const queryString = `DELETE FROM "ocm-visitors_visitors" WHERE user_id IN (${userIds.map((id, index) => `$${index + 1}`).join(', ')})`;

        const params = userIds.map(id => id); 

        const result = await pool.query(queryString, params);
        console.log(result);    
    

    } catch (error) {
        console.log(error);
    }
}

pool.connect()
    .then(() => {
        console.log('connected to Postgres on port: 5432');
        cron.schedule('0 0 * * *', async () => {
            try {
                await deleteOldVisitors();
                console.log('Successfully deleted old visitors');
            } catch (error) {
                console.error('Cron job error:', error);
            }
        });

    })
    .catch((err) => {
        console.error('connection error', err.stack);
    })


