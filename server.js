const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const cors = require("cors");
require("dotenv").config();
const authRoute = require("./routers/auth");
const geminiRoute = require("./routers/gemini");
const dbRoute = require('./routers/db');
const jwtRoute = require('./routers/jwt');

const PORT = 4649;

const corsOpt = {
  origin: ["http://localhost:3000"],
  credentials: true,
}

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOpt));

app.use("/api/auth", authRoute);
app.use("/api/gemini", geminiRoute);
app.use("/api/db", dbRoute);
app.use("/api/jwt", jwtRoute);

app.listen(PORT, () => console.log(`server is running on Port ${PORT}`));