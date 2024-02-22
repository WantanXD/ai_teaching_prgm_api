const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwtHelper = require('./jwtHelper');
const ms = require('ms');

// ユーザ登録
router.post("/register", async(req, res) => {

  try {

    const { name, email, pass } = req.body;
    
    // メールアドレスが登録済みであるか確認する
    const existUser = await prisma.authenticate.findFirst({
      where : {
        email,
      }
    });
    if (existUser !== null) {
      console.log(existUser);
      throw new Error('EMAIL_ALREADY_REGISTERED');  
    }

    // ランダムなソルト値を生成し、同じパスワードでもユーザごとに異なるハッシュ値で保存されるようにする
    const salt = Math.floor(Math.random() * 65535);
    const saltedPass = salt + pass;
    const hashedPass = await bcrypt.hash(saltedPass, 10);
    if (!hashedPass) {
      throw new Error('SERVER_ERROR');  
    }
    
    // supabase上のDBにデータを送信
    await prisma.authenticate.create({
      data : {
        name,
        email,
        pass:hashedPass,
        salt
      }
    });

    const jwtToken = jwtHelper.createToken(email, name);

    return res.status(200).cookie("jwtToken", jwtToken, {
      httpOnly: true,
      expires: new Date(Date.now() + ms("2d")),  
    });
  }catch (e) {
    console.log(e);
  }
});

// ユーザログイン
router.post("/login", async(req, res) => {

  try {
    const {email, pass} = req.body;

    if (!email || !pass) {
      throw new Error("INVALID_VALUE");  
    }

    const user = await prisma.authenticate.findFirst ({
      where: {
        email: email
      }
    });
    if (!user) {
      throw new Error("NOT_EXIST_USER");  
    }

    // パスワードを比較する
    const match = await bcrypt.compare(user.pass === (pass + user.salt));
    if (match) {
      const jwtToken = jwtHelper.createToken(user.email, user.name);
      res.cookie("jwtToken", jwtToken, {
        httpOnly: true,
        expires: new Date(Date.now() + ms("2d")),
      }).json({
        user: {id: user.id}
      });
    }else {
      throw new Error("SERVER_ERROR");  
    }
  }catch (e) {
    if (e instanceof Error) {
      console.log(e.message);  
    }
  }
})

module.exports = router;