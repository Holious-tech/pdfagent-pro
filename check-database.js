const { PrismaClient } = require('@prisma/client');

async function checkDatabase() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'file:dev.db'
      }
    },
  });
  
  try {
    await prisma.$connect();
    
    // Check documents
    const documents = await prisma.document.findMany();
    console.log(`📄 Found ${documents.length} documents:`);
    documents.forEach(doc => {
      console.log(`  - ID: ${doc.id}`);
      console.log(`    Name: ${doc.fileName}`);
      console.log(`    Size: ${doc.fileSize} bytes`);
      console.log(`    Summary length: ${doc.summary?.length || 0} chars`);
      console.log(`    Uploaded: ${doc.uploadedAt}`);
    });
    
    // Check events
    const events = await prisma.event.findMany();
    console.log(`\n📊 Found ${events.length} events:`);
    events.forEach(event => {
      console.log(`  - ID: ${event.id}`);
      console.log(`    Type: ${event.type}`);
      console.log(`    Document ID: ${event.documentId}`);
      console.log(`    Created: ${event.createdAt}`);
      
      // Parse metadata
      try {
        const metadata = JSON.parse(event.metadata);
        console.log(`    Duration: ${metadata.durationMs}ms`);
        console.log(`    File: ${metadata.fileName}`);
        console.log(`    Text length: ${metadata.textLength}`);
        console.log(`    Summary length: ${metadata.summaryLength}`);
      } catch (e) {
        console.log(`    Metadata: ${event.metadata}`);
      }
    });
    
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('❌ Database check failed:', error);
    await prisma.$disconnect();
  }
}

checkDatabase();
