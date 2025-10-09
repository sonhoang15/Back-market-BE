import express from "express";
import configViewEngine from "./config/viewEngine.js";
import bodyParser from "body-parser";
import initApiRoutes from "./routes/api.js";
import initWebRoutes from "./routes/web.js";
import configcors from "./config/cors.js";
import cookieParser from 'cookie-parser'
import connection from "./config/connectDB.js"
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// connection();
configcors(app);

configViewEngine(app);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cookieParser())


initWebRoutes(app);
initApiRoutes(app);


app.use((req, res) => {
    return res.send("404 not fond")
})



app.listen(PORT, () => {
    console.log("backend runing " + PORT)
})

