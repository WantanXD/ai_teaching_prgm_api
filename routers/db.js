const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require('./jwtHelper');

router.post('/QandARegister', async(req, res) => {
  
  const {lang, question, answer, tof, modelAnswer, comment} = req.body;
  let userId;
  const jwtKey = process.env.SECRET_JWT;

  // ユーザIdをjwtから取得
  const token = localStorage.getItem('jwt');
  if (token !== null) {
    try {
      const decodedToken = verify(token, jwtKey);

      userId = await prisma.authenticate.findFirst({
        id,
        where: {
          userId: decodedToken.id,
        },
      });
    }catch(error) {
    }
  }
  
  const QandAData = await prisma.qandadata.create ({
    data : {
      userId,
      lang,
      tof,
      question,
      answer,
      model_answer: modelAnswer,
      comment,
    }
  });

  return res.json({ QandAData });
});

router.post('/getUserIdFromEmail', async(req, res) => {

  const {email} = req.body;
  const returnData = await prisma.authenticate.findFirst ({
    select: {
      id: true,
    },
    where: {
      email: email,
    }
  });
  return res.json({returnData});
});

module.exports = router;