const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwtHelper = require('./jwtHelper');

router.post('/QandARegister', async(req, res) => {
  
  const {lang, question, answer, tof, modelAnswer, comment, userId} = req.body;

  const boolTof = tof === 'Apple' ? true : false;
  
  await prisma.QAData.create({
    data: {
      userId,
      lang,
      tof: boolTof,
      question,
      answer,
      modelAns: modelAnswer,
      comment
    }
  })

  return res.json({ registered: true });
})

module.exports = router;