const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('Testing database connection...');
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  
  try {
    // Try to connect and run a simple query
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Try to count documents
    const count = await prisma.document.count();
    console.log(`📊 Found ${count} documents in database`);
    
    await prisma.$disconnect();
    console.log('✅ Disconnected successfully');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.error('Error details:', error.message);
    console.error('Error code:', error.code);
    console.error('Error meta:', error.meta);
    
    await prisma.$disconnect();
  }
}

testConnection();
