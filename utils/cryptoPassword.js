require('dotenv').config();
const crypto=require('crypto');

const algorithm='aes-256-ctr' //Algorithm to use for encryption
const secretKey=Buffer.from(process.env.PASSWORD_KEY,'hex');

const encryptPassword=(password)=>{
    const iv=crypto.randomBytes(16); //Initialization vector;
    const cipher=crypto.createCipheriv(algorithm,secretKey,iv);
    let encrypted=cipher.update(password,'utf8','hex');
    encrypted+=cipher.final('hex');
    return {iv:iv.toString('hex'),content:encrypted};
}

const decryptPassword = (hash) => {
    const { iv, content } = hash; // Extract iv and content from the hash
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'),Buffer.from(iv,'hex'));
    let decrypted =decipher.update(content,'hex','utf8');
    decrypted+=decipher.final('utf8');
    
    return decrypted    
  };

  module.exports={
    encryptPassword,decryptPassword
  }