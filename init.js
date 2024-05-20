const mongoose= require("mongoose");
const Chat= require("./models/chat.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp")
}

main().then((res)=>{console.log("Initialization Successful")})
.catch((err)=>{console.log(err)});

let allChats = [
    {
        from: "Yogesh",
        to: "Rahul",
        message: "Let's work on a web development project",
        created_at: new Date(),
    },
    {
        from: "Rahul",
        to: "Yogesh",
        message: "Yeah, let's make a project roadmap",
        created_at: new Date(),
    },
    {
        from: "Rahul",
        to: "Shanu",
        message: "We have a meeting to discuss project roadmap",
        created_at: new Date(),
    },
    {
        from: "Shanu",
        to: "Rahul",
        message: "I have already made a basic roadmap",
        created_at: new Date(),
    },
    {
        from: "Rahul",
        to: "Yogesh",
        message: "Meeting is at 12pm tonight",
        created_at: new Date(),
    },
];

Chat.insertMany(allChats).then((res)=>{console.log(res)})
.catch((err)=>{console.log(err)});

