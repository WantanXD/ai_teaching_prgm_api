const router = require('express').Router();
const jwtHelper = require('./jwtHelper');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const ms = require('ms');

router.post('/tokenVerification', async(req, res) => {
  const { jwtToken } = req.body;
  const decodedToken = jwtHelper.verifyToken(jwtToken);

  if (decodedToken) {
    const token = jwtHelper.createToken(decodedToken.email, decodedToken.name, new Date(Date.now() + ms('2d')));
    const user = await prisma.authenticate.findFirst({
      where: {
        email: decodedToken.email,
      }
    })
    return res.json(
      { 
        isAuthenticated: true,
        user: {
          name: decodedToken.name,
          id: user.id,
        },
        jwtToken: token
      }
    );
  }else {
    return res.json({
      isAuthenticated: false,
    })
  }
});

module.exports = router;