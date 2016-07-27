import jwt from 'jsonwebtoken';
import config from '../../config';
import HttpError from '../utils/HttpError';

function signToken(id, role){
  const claim = {
    sub: id,
    aud: config.jwt.aud,
    role
  }

  return jwt.sign(claim, config.jwt.secret, {expiresIn: config.jwt.expiresIn});
}

function verifyToken(token){
  return new Promise((resolve, reject) => {  
    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if(err) {
        reject(new HttpError(401));
      }else{
        const timeToExpire = decoded.exp - Math.floor( Date.now()/1000 );

        if(timeToExpire < config.jwt.refreshTime){
          resolve({token: signToken(decoded.sub), sub: decoded.sub, role: decoded.role});
        }else{
          resolve({token: false, sub: decoded.sub, role: decoded.role});
        }
      }
    });
  });
}

export default {
  signToken,
  verifyToken
}