const { jwt, verify, sign } = require('jsonwebtoken');

class jwtHelper {
  
  static secretJwt = process.env.SECRET_JWT;

  static createToken(email, name, deadline) {
    const token = sign({ email, name, deadline }, this.secretJwt, { algorithm:'HS256', expiresIn:'30d' });
    return token;
  }

  static verifyToken(token) {
    try {
      const decodedToken = verify(token, this.secretJwt);
      return decodedToken;
    }catch (e) {
      console.log(e);
    }
  }
}

module.exports = jwtHelper;