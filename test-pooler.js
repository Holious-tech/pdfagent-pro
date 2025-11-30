const https = require('https');

function testPoolerConnection() {
  const options = {
    hostname: 'aws-0-eu-west-2.pooler.supabase.com',
    port: 5432,
    method: 'GET',
    timeout: 5000
  };

  const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log('✅ Supabase Pooler is reachable');
  });

  req.on('error', (err) => {
    console.error('❌ Pooler connection failed:', err.message);
    
    // Try the direct connection as fallback
    console.log('\nTrying direct connection test...');
    const directOptions = {
      hostname: 'db.zmhdzhyqkvuvbpufztml.supabase.co',
      port: 5432,
      method: 'GET',
      timeout: 5000
    };

    const directReq = https.request(directOptions, (res) => {
      console.log('✅ Direct connection works');
    });

    directReq.on('error', (err) => {
      console.error('❌ Direct connection also failed:', err.message);
    });

    directReq.on('timeout', () => {
      console.error('❌ Direct connection timeout');
      directReq.destroy();
    });

    directReq.end();
  });

  req.on('timeout', () => {
    console.error('❌ Pooler connection timeout');
    req.destroy();
  });

  req.end();
}

testPoolerConnection();
