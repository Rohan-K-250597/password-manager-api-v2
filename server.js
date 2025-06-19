require("./db");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const app = express();

const PORT = process.env.PORT;

const { userRouter } = require("./routers/auth.router");
const passwordRouter = require("./routers/password.router");
const masterRouter = require("./routers/master.router");
const corsOptions = {
    origin: "https://anzen-password.netlify.app", // Replace with your frontend URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204
};
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});

app.get("/", (req, res) => {
    res.send("You are using Anzen Server");
});
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use("/password-manager", userRouter);
app.use("/passwords", passwordRouter);
app.use("/master", masterRouter);
//Global Error Handler
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

//Global 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
