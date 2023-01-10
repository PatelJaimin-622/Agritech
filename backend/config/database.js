const mongoose = require("mongoose");

//,useCreateIndex:true

    const connectDatabase = ()=>{
        mongoose.connect(process.env.DB_URI,{useNewUrlParser:true,useUnifiedTopology:true}).then(
            (data)=>{
                console.log(`Mongodb Connected with server:${data.connection.host}`);
            });
    };

    module.exports = connectDatabase