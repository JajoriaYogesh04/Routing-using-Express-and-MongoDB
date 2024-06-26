const express= require("express");
const app= express();
const port= 8080;
const mongoose= require("mongoose");
const path= require("path");
const Chat= require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError= require("./ExpressError.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}

main().then((res)=>{console.log("Mongoose Connection Successful")})
.catch((err)=>{console.log(err)});

//WrapAsync
function asyncWrap(fn){
    return function(req, res, next){
        fn(req, res, next).catch((err)=>next(err));
    };
}

// let chat1= new Chat({
//     from: "Yogesh",
//     to: "Aryan",
//     message: "Hello Brother",
//     created_at: new Date(),
// })
// chat1.save().then((res)=>{console.log(res)})
// .catch((err)=>{console.log(err)});

// let chat2= new Chat({
//     from: "Yogesh",
//     to: "Anubhav",
//     message: "Bro Mess chale kya",
//     created_at: new Date(),
// })
// chat2.save().then((res)=>{console.log(res)})
// .catch((err)=>{console.log(err)});


//Index Route
app.get("/chats", async (req, res, next)=>{
    try{
        let chats= await Chat.find();
        console.log(chats);
        // res.send("Chat route working");
        res.render("index.ejs", { chats })
    }catch(err){
        next(err);
    }
})

//New Route
app.get("/chats/new", (req,res)=>{
    console.log("New Route Working");
    // throw new ExpressError(404, "Page Not Found");
    // res.send("Upload Form");
    res.render("new.ejs");
})

//Create Route
app.post("/chats", async (req, res, next)=>{
    try{
        console.log("Ready to create route");
        let {from, msg, to}=req.body;
        let newChat= new Chat({
            from: from,
            message: msg,
            to: to,
            created_at: new Date(),
        })
        await newChat.save();
        res.redirect("/chats")
    }
    catch(err){
        next(err);
    }
})

//Show Route

app.get("/chats/:id", asyncWrap(async (req, res, next)=>{
        let {id}= req.params;
        let showChat= await Chat.findById(id);
        if(!showChat){
            return next(new ExpressError(405, "Chat Not Found"))
        }
        // console.log(showChat);
        res.render("show.ejs", { showChat })
}))

//Edit Route
app.get("/chats/:id/edit", async (req, res, next)=>{
    try{
        let {id}= req.params;
        let editChat= await Chat.findById(id);
        console.log(editChat);
        res.render("edit.ejs", { editChat }); 
    }catch(err){
        next(err);
    }
})

// Upadate Route
app.put("/chats/:id", async (req,res)=>{
    try{
        let { id }= req.params;
        let {editMsg: newMsg}= req.body;
        // console.log(newMsg);
        let updatedChat= await Chat.findByIdAndUpdate(id, {message: newMsg}, {runValidators: true, new: true})
        // console.log(updatedChat);
        res.redirect("/chats");
    }
    catch(err){
        next(err);
    }
})

//Distroy Route
app.delete("/chats/:id", async (req, res)=>{
    try{
        // res.send("Getting Delete Request");
        let { id }= req.params;
        let deletedChat= await Chat.findByIdAndDelete(id);
        console.log(deletedChat);
        res.redirect("/chats");
    }
    catch(err){
        next(err);
    }
    
})

app.get("/", (req, res)=>{
    res.send("Express Working");
})

// Error Handling Middleware

const handleValidationErr= (err)=>{
    // console.log("________VALIDATION ERROR________");
    console.dir(err.message);
    return err;
}

app.use((err, req, res, next)=>{
    console.log(err.name);
    if(err.name==="ValidationError"){
        // console.log("________VALIDATION ERROR________");
        err= handleValidationErr(err);
    }
    next(err);
})

app.use((err, req, res, next)=>{
    let { status= 500, message="SOME ERROR" }= err;
    res.status(status).send(message);
})

app.listen(port,()=>{
    console.log("App is listening to port 8080");
})