const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

// ユーザ登録
router.post("/register", async(req, res) => {
    const { name, email, pass } = req.body;

    // ランダムなソルト値を生成し、同じパスワードでもユーザごとに異なるハッシュ値で保存されるようにする
    const salt = Math.floor(Math.random() * 65535);
    const saltedPass = salt + pass;
    const hashedPass = await bcrypt.hash(saltedPass, 5);
    
    // supabase上のDBにデータを送信
    const user = await prisma.authenticate.create({
        data : {
            name,
            email,
            pass:hashedPass,
            salt
        }
    });

    return res.json({ user });
});

// ユーザログイン
//router.post("/login")
module.exports = router;