const { PrismaClient } = require('@prisma/client');

async function testSQLite() {
  console.log('Testing SQLite connection...');
  
  // Force SQLite connection
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'file:dev.db'
      }
    },
    log: ['query', 'info', 'warn', 'error'],
  });
  
  try {
    // Try to connect and run a simple query
    await prisma.$connect();
    console.log('✅ SQLite connection successful!');
    
    // Try to count documents
    const count = await prisma.document.count();
    console.log(`📊 Found ${count} documents in database`);
    
    await prisma.$disconnect();
    console.log('✅ Disconnected successfully');
    
  } catch (error) {
    console.error('❌ SQLite connection failed:', error);
    console.error('Error details:', error.message);
    
    await prisma.$disconnect();
  }
}

testSQLite();
