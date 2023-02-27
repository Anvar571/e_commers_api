require("dotenv").config();

const express = require("express");
const db_connection = require("./config/dbConnection");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const routers = require("./routers/routers");
const app = express();
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const PORT = process.env.PORT
const fs = require("fs");
const path = require('path');

const projectLog = fs.createWriteStream(path.join(__dirname, "projectlog.log"), {flags: "a"});

morgan.token("type", (req, res) => {
    return req.headers["content-type"]
})

// global middleware 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :date[web] :type', {stream: projectLog}));

async function server(){
    try {
        db_connection();
    }catch(err) {
        console.log(err);
    }
     finally {
        app.use("/api", routers);

        app.use(notFound);
        app.use(errorHandler);
    }
}

server()

app.listen(PORT, () => {
    console.log("server listen on ", PORT, " port");
})