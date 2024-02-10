const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

// ユーザ登録
router.post("/register", async(req, res) => {
    const { name, email, pass } = req.body;

    const salt = Math.floor(Math.random() * 65535);
    const password = salt + pass;
    const hashedPassword = await bcrypt.hash(password, 5);
    
    const user = await prisma.authenticate.create({
        data : {
            name,
            email,
            pass:hashedPassword,
            salt
        }
    });

    return res.json({ user });
});

// ユーザログイン
//router.post("/login")
module.exports = router;