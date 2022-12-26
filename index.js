require('dotenv').config();
const express = require('express');
const app = express();
const cors = require("cors");

app.use(cors());

const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const merchantRoutes = require('./routes/merchant');
const productRoutes = require("./routes/product");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const dbURL = process.env.MONGO_URL;
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("MongoDB Connected");
}).catch((e)=>{
    console.log(e);
})
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use("/api/user",authRoutes);
app.use("/api/user/posts",postsRoutes);
app.use("/api/merchant",merchantRoutes);
app.use("/api/product",productRoutes);

app.listen(process.env.PORT,()=>{
    console.log("Server is running on port " + process.env.PORT);
})