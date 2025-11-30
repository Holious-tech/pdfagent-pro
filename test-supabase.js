const https = require('https');

function testSupabaseConnection() {
  const options = {
    hostname: 'db.zmhdzhyqkvuvbpufztml.supabase.co',
    port: 5432,
    method: 'GET',
    timeout: 5000
  };

  const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log('✅ Supabase is reachable');
  });

  req.on('error', (err) => {
    console.error('❌ Supabase connection failed:', err.message);
    console.log('\nPossible solutions:');
    console.log('1. Check your internet connection');
    console.log('2. Try from a different network (home vs office)');
    console.log('3. Check if VPN/firewall is blocking port 5432');
    console.log('4. Verify Supabase database is running');
  });

  req.on('timeout', () => {
    console.error('❌ Connection timeout - network likely blocked');
    req.destroy();
  });

  req.end();
}

testSupabaseConnection();
