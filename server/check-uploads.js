const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const uploadsDir = path.join(__dirname, 'uploads');

async function checkUploads() {
  console.log('📁 Checking uploads folder...');
  
  // Check physical files
  if (!fs.existsSync(uploadsDir)) {
    console.log('⚠️  Uploads directory does not exist');
    return;
  }

  const files = fs.readdirSync(uploadsDir);
  console.log(`✅ Found ${files.length} files in uploads folder:`);
  files.forEach(f => {
    const fullPath = path.join(uploadsDir, f);
    const stat = fs.statSync(fullPath);
    console.log(`   - ${f} (${stat.size} bytes)`);
  });

  // Check database records
  console.log('\n📊 Checking database complaints...');
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const Complaint = require('./models/Complaint');
    const complaints = await Complaint.find({ images: { $exists: true, $not: { $size: 0 } } });
    
    console.log(`✅ Found ${complaints.length} complaints with images`);
    complaints.forEach(c => {
      console.log(`\n   Complaint: ${c._id}`);
      console.log(`   Title: ${c.title}`);
      console.log(`   Images stored in DB:`);
      c.images.forEach(img => {
        const exists = fs.existsSync(path.join(uploadsDir, img));
        const status = exists ? '✅ EXISTS' : '❌ MISSING';
        console.log(`      ${status} - ${img}`);
      });
    });

    await mongoose.connection.close();
  } catch (err) {
    console.error('❌ Database error:', err.message);
  }
}

checkUploads();
