const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    // Intentional vulnerability: Using original filename without proper sanitization
    cb(null, file.originalname);
  }
});

// File filter with intentional vulnerabilities
const fileFilter = (req, file, cb) => {
  // Intentional vulnerability: Weak file type validation
  // Only checks extension, not actual file content
  // Can be bypassed with double extension (e.g., malicious.php.jpg)
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed'), false);
  }
};

// Initialize upload with intentional vulnerabilities
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB limit
  fileFilter: fileFilter
});

module.exports = upload;
