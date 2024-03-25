const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const authRoute = require("./routers/auth");
const geminiRoute = require("./routers/gemini");
const dbRoute = require('./routers/db');
const jwtRoute = require('./routers/jwt');

const PORT = 4649;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoute);
app.use("/api/gemini", geminiRoute);
app.use("/api/db", dbRoute);
app.use("/api/jwt", jwtRoute);

app.listen(PORT, () => console.log(`server is running on Port ${PORT}`));