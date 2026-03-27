const crypto = require('crypto');
const generateSHA256Hash = info =>{
    return crypto.createHash('sha256').update(info).digest('hex');
}

module.exports = generateSHA256Hash;