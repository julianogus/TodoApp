const crypto = require('crypto');

const encryptData = (datum, key) => {
    const algorithm = 'aes-256-gcm';
    const iv = crypto.randomBytes(16); 
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(datum, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    return {
        datum: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
    };
}

const decryptData = (encryptedData, key) => {
    const algorithm = 'aes-256-gcm';
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const authTag = Buffer.from(encryptedData.authTag, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedData.datum, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

const encryptTodo = (todo) => {
    const key = Buffer.alloc(32, process.env.TODO_KEY);
    return encryptData(todo, key);
}

const decryptTodo = (encryptedTodo) => {
    const key = Buffer.alloc(32, process.env.TODO_KEY);
    return decryptData(encryptedTodo, key);
}

const encryptEmail = (email) => {
    const key = Buffer.alloc(32, process.env.EMAIL_KEY);
    return encryptData(email, key);
}

const decryptEmail = (encryptedEmail) => {
    const key = Buffer.alloc(32, process.env.EMAIL_KEY);
    return decryptData(encryptedEmail, key);
}

module.exports = {
    encryptTodo: encryptTodo,
    decryptTodo: decryptTodo,
    encryptEmail: encryptEmail,
    decryptEmail: decryptEmail
}