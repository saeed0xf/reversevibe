// JWT configuration with intentional vulnerabilities
module.exports = {
  // Intentional vulnerability: Weak and predictable JWT secret
  // This is intentionally weak for CTF purposes
  secret: 'reversevibe2025',
  
  // Intentional vulnerability: Long expiration time
  expiresIn: '30d',
  
  // Intentional vulnerability: Algorithm can be changed in header
  algorithm: 'HS256'
};
