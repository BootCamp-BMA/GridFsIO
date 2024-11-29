//app.js

const express = require('express')
const bodyParser=require('body-parser')
const app = express();
const route=require('./route/fileRoot')
const {connectMongo} = require('./config/db')


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

app.use('/',route);


app.listen(5001,'0.0.0.0',()=>{

    connectMongo();
    console.log('listing on 5001');
    
})