const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const path = require('path');
const app = express();
app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyparser.urlencoded({extended:true}));
mongoose.connect("mongodb://127.0.0.1:27017/FleskaDsB"),{
    useNewUrlParser:true
}

const productSchema = mongoose.Schema({
    NAME:String,
    PRICE: Number,
    AVAILABLE: Number,
    DEFAULT: String
});
const product = new mongoose.model("product",productSchema);


app.get("/",async (req,res) => {
    var data = await product.find({DEFAULT: "products"})

    res.render("index",{load: data})
})

app.get("/create", (req,res) => {
    res.render("create",{message: "Add your product by filling the form"});
})

app.post("/create", (req,res) => {
    var name = req.body.name;
    var price= req.body.price;
    var available = req.body.available;

    async function connection(){
        const a = await product.create({NAME: name, PRICE: price, AVAILABLE: available, DEFAULT: "products"})
    }
    connection();
    res.render("create",{message: "Product added succesfully"});
})

app.get("/edit", async (req,res) => {
    var data = await product.find({DEFAULT: "products"})

    res.render("edit",{load: data})
})

app.post("/edit", async (req,res) => {
var logic = req.body.save;
if(logic == "search"){
    var par = req.body.parameter
    var data = await product.find({NAME: par})
    res.render("edit",{load: data})
}
else if(logic == "update"){
    var fname = req.body.fname;
    var name = req.body.name;
    var price = req.body.price;
    var available = req.body.available;
    async function connection(){
        await product.updateMany({NAME: fname},{$set: {NAME: name, PRICE: price, AVAILABLE: available}});
    }
    connection();
    var data = await product.find({DEFAULT: "products"})
    res.render("edit",{load: data})
}
else if(logic == "delete"){
    var name = req.body.name;
    async function connection(){
        await product.deleteOne({NAME: name})
    }
    connection();
    var data = await product.find({DEFAULT: "products"});
    res.render("edit",{load: data})
}

})

app.listen(3000, function(){
    console.log("Server started at port 3000")
});