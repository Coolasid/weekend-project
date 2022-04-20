const JWT = require('jsonwebtoken');

const newToken = (user) => {
  return JWT.sign({ user: user }, 'laskjdflkjadkfl');
};


const verifyToken = (token) =>{
    return new Promise((resolve, reject)=>{
        JWT.verify(token, 'laskjdflkjadkfl', (err, decoded) =>{
            if(err) return reject(err);

            resolve(decoded);
        });
    })
}

module.exports = {newToken, verifyToken};
