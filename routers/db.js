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
});

router.post('/getLangRate', async(req, res) => {

  const {userId} = req.body;

  const langRate = await prisma.QAData.groupBy({
    by: ['lang'],
    where: {
      userId: userId,
    },
    _count: {
      userId: true,
      tof: true
    },
  });

  return res.json({ langRate });
});

router.post('/getTofRate', async(req, res) => {

  const {userId} = req.body;

  const tofRate = await prisma.QAData.groupBy({
    by: ['lang'],
    where: {
      userId: userId,
      tof: true,
    },
    _count: {
      tof: true,
    },
  });

  return res.json({ tofRate });
});

module.exports = router;