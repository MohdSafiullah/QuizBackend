require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose")
const parser = require("body-parser");
const cors = require("cors")
const app = express();

app.use(parser.urlencoded({extended: true}));
app.use(cors({optionsSuccessStatus:200}))
app.use(parser.json())

mongoose.connect(process.env.DBURL)
.then(()=>console.log("database is connected"))

const quizSchema = new mongoose.Schema({
    quizname: {type: String},
    quizdescription: {type: String},
    marksystem: {type: String},
    duration: {type: String},
    questionlist: [
        { question: {type: String},
        optionA: {type: String},
        optionB: {type: String},
        optionC: {type: String},
        optionD: {type: String},
        answer: {type: String}}
    ]
})

const quizmodel = mongoose.model("quiz", quizSchema); 

app.get("/", (req,res)=>{
    res.send("Server is up and running")
})

app.get("/getquizzes", (req,res)=>{
    quizmodel.find({})
    .then((result)=>{
        res.json(result)
    })
})

app.post("/getQuestionList", (req,res)=>{
    quizmodel.find({_id: req.body.objid}, 'questionlist marksystem')
    .then((result)=>{
        // console.log(result)
        res.json(result)
    })
})

app.post("/createquiz", (req, res)=>{
    const newQuiz = new quizmodel(req.body);
    quizmodel.create(newQuiz)
    .then((response)=>{
        res.json({success: true, id: response._id})
    }).catch(()=>{
        res.json({success: false})
    })
});

app.post("/addQuestion", (req,res)=>{
     quizmodel.findOneAndUpdate({_id: req.body.id}, {$push: {questionlist: req.body.questionObj}}, {new: true})
    .then((response)=>{
        // console.log(response)
        res.json({success: true, ...response})
    }).catch(()=>{
        res.json({success: false})
    })
})


app.listen(process.env.PORT || 80, ()=>{
    console.log("Server is running")
})
