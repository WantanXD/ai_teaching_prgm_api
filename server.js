const express = require("express");
const app = express();

const PORT = 4649;

app.listen(PORT, () => console.log(`server is running on Port ${PORT}`));