require("dotenv").config();
const express=require("express")
const cors=require("cors");
const authRoutes=require('./routes/authRoutes');
const sessionRoutes=require('./routes/sessionRoutes')
const questionRoutes=require('./routes/questionRoutes')
const {protect}=require('./middlewares/authMiddleware');
const {generateInterviewQuestions,generateConceptExplanation}=require("./controllers/aiController");

const path=require("path");

const connectDB = require("./config/db");

const app=express();

//middleware to handle cors
app.use(
    cors({
        origin:"*",
        methods:["GET","POST","PUT","DELETE"],
        allowedHeaders:["Content-Type","Authorization"],
    })
);

connectDB()


//middleware
app.use(express.json());

//Routes
app.use("/api/auth",authRoutes);
app.use('/api/sessions',sessionRoutes);
app.use('/api/questions',questionRoutes);

app.post('/api/ai/generate-questions',protect,generateInterviewQuestions);
app.post('/api/ai/generate-explanation',protect,generateConceptExplanation);

//server uploads folder
app.use("/uploads",express.static(path.join(__dirname,"uploads"),{}));


app.get("/", (req, res) => {
  res.send("Server is running! 🚀");
});

//start server
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`server running on port ${PORT}`));