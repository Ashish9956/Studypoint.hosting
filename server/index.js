const express=require('express')
const mongoose=require('mongoose');
const app=express();
const dotenv = require("dotenv");
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const contactUsRoute = require("./routes/Contact");
dotenv.config();
const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(cookieParser());
// mongoose connection
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlparser:true,
    useUnifiedTopology:true,
})
.then(()=>{
    console.log("DB connected successfully");
})
.catch((error)=>{
    console.log("DB connection failed");
    console.error(error);
    process.exit(1);
})

// middle wares
app.use(express.json());
app.use(
	cors({
		origin:"*",
		credentials:true,
	})
)



//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/reach", contactUsRoute);




// by default route
app.get('/',(req,res)=>{
    res.send("<h1>it by default route</h1>")
});

// active
app.listen(PORT,()=>{
    console.log(`server is runing ${PORT} `)
})
