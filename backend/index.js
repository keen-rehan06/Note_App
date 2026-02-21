import cookieParser from "cookie-parser";
import express from "express"
import {connectDB} from "./db/db.js";
import dotenv from "dotenv"
dotenv.config();

(async()=>{
    try {
        await connectDB();
    } catch (error) {
        console.log("MongoDb connection Failed:",error)
    }
})();

const app = express();

app.use(express.json({}))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.get("/",function(req,res){
    console.log("Running")
    res.send("Running")
})

app.listen(3000,function(){
    console.log("App is runnig on port 3000")
})