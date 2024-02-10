const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const authRoute = require("./routers/auth");

const PORT = 4650;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoute);

app.listen(PORT, () => console.log(`server is running on Port ${PORT}`));