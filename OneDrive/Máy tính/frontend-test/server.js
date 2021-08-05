const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

app.use(cors());
app.use(express.json());

// const uri = "mongodb+srv://tien:1234567890@cluster-1.zwd9b.mongodb.net/accountDB";

// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect("mongodb+srv://tien:1234567890@cluster-1.zwd9b.mongodb.net/accountDB", {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {console.log('successfully')});

app.use("/", require("./routes/signupRoute"));

app.listen(3001, function() {
    console.log("Server is running on port 3001");
})