const app = require("./app")
const dotenv = require("dotenv");
const cloudinary = require("cloudinary")
const { path } = require("./app");
const connectDatabase = require("./config/database")

//HAndling unquote Exception 
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the error due to Unhandle Promise Rejection`);
    process.exit(1);
})
//config
dotenv.config({path:"backend/config/config.env"})

//connect database

connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const server = app.listen( process.env.PORT,()=>{
    console.log(`Server is working on https://localhost:${process.env.PORT}`)

})


//Unhandled promise Rejection

process.on("unhandledRejection",(err)=>{
console.log(`Error:${err.message}`);
console.log(`shutting down the error due to Unhandle Promise Rejection`);

server.close(()=>{
    process.exit(1);
});

});