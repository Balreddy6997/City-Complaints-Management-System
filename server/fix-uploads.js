const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const uploadsDir = path.join(__dirname, 'uploads');

async function fixMissingImages() {
  console.log('🔧 Fixing missing image references...\n');
  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const Complaint = require('./models/Complaint');
    
    const complaints = await Complaint.find({ images: { $exists: true, $not: { $size: 0 } } });
    console.log(`Checking ${complaints.length} complaints with images...\n`);
    
    let fixed = 0;
    for (const complaint of complaints) {
      const missingImages = complaint.images.filter(img => 
        !fs.existsSync(path.join(uploadsDir, img))
      );
      
      if (missingImages.length > 0) {
        console.log(`⚠️  Complaint "${complaint.title}" (${complaint._id}):`);
        console.log(`   Missing images: ${missingImages.join(', ')}`);
        
        // Remove missing images from the complaint
        complaint.images = complaint.images.filter(img => 
          fs.existsSync(path.join(uploadsDir, img))
        );
        
        if (complaint.images.length === 0) {
          await complaint.deleteOne();
          console.log(`   ✅ Deleted complaint (no images left)\n`);
        } else {
          await complaint.save();
          console.log(`   ✅ Removed missing images, kept ${complaint.images.length}\n`);
        }
        fixed++;
      }
    }
    
    console.log(`✅ Fixed ${fixed} complaint(s)`);
    await mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

fixMissingImages();
