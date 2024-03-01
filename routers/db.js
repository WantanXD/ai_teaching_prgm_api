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

  const returnData = await prisma.QAData.groupBy({
    by: ['lang'],
    where: {
      userId: userId,
    },
    _count: {
      userId: true,
    },
  });

  return res.json({ returnData });
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

  const langRate = await prisma.QAData.groupBy({
    by: ['lang'],
    where: {
      userId: userId,
    },
    _count: {
      userId: true,
    },
  });

  const tofMap = tofRate.reduce((acc, item) => {
    acc[item.lang] = item._count.tof;
    return acc;
  }, {});

  const returnData = langRate.map(item => {
    return {
      ...item,
      _count: {
        ...item._count,
        tof: tofMap[item.lang] || 0,
      }
    }
  });

  return res.json({ returnData });
});

module.exports = router;