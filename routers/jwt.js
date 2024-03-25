const router = require('express').Router();
const jwtHelper = require('./jwtHelper');
const ms = require('ms');

router.post('/tokenVerification', async(req, res) => {
  
  let token = ''
  if (req.cookies.jwtToken) {
    token = req.cookies.jwtToken;
  } else {
    return res.status(200).json({ isAuthenticated: false });
  }

  const decode = jwtHelper.verifyToken(token);
  if (decode) {
    const token = jwtHelper.createToken(decode.email, decode.name);
    const res = await fetch('./db/getUseridFromEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: decode.email })
    });
    const userId = res.returnData.id;
    res.cookie("jwtToken", token, {
      httpOnly: true,
      expires: new Date(Date.now() + ms('2d')),     // tokenの有効期限を2日にしている
    });
    res.status(200).json(
      { 
        isAuthenticated: true,
        loginUser: decode.name,
        loginUserId: userId,
      }
    );
  }
});

module.exports = router;