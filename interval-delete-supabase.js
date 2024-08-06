require('dotenv').config();
const cron = require('node-cron');
const { createClient } = require('@supabase/supabase-js');


async function deleteOldVisitors() {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PRIVATE_SERVICE_ROLE_KEY, 
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )
        const users = await supabase.auth.admin.listUsers();
        const visitors = users.data.users.filter(user => !user.app_metadata.claims_admin);

        for (i = 0; i < visitors.length; i++) {
            await supabase.auth.admin.deleteUser(visitors[i].id);
            console.log(`Deleted user with id: ${visitors[i].id}`);
        }

    } catch (error) {
        console.error(error);
    }
}

cron.schedule('0 0 * * 7', async () => {
    try {
        await deleteOldVisitors();
        console.log('Successfully deleted old visitors');
    } catch (error) {
        console.error('Cron job error:', error);
    }
});