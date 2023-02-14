const express = require('express');
const app = express();
const fetch = require('node-fetch');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');
const https = require('https')
var items = []

const uri = "mongodb+srv://phuthanet:18052001Phu@cluster0.00fi7bc.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// Check DB connection
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    if (err) console.log(err);
    else console.log("Database Connect Successfully!");
    client.close();
  });
  MongoClient.connect(uri, (err, db)=>{
    var dbo = db.db("Users"); // Create Database
    // dbo.createCollection("Profile", (err, res)=>{ // Create Table
    //     if (err) console.log(err);
    //     else console.log("create successfully");
    //     db.close();
    // });
    // Insert One Data
    // var myObj = {name:"Chanakarn", id: "624", hobby : "travel", study : "PIM"}; // Data to be inserted
    // dbo.collection("Profile").insertOne(myObj, (err, res)=>{
    //     if (err) console.log(err);
    //     if (res) console.log ("insert data successfully");
    // });
    // Insert Many Data
    // var myObjArr = [
    //     {name:"Hayate", position:"Carry"},
    //     {name:"Thane", position: "Tank"},
    //     {id:555, address:"Thailand"}
    // ];
    // dbo.collection("Profile").insertMany(myObjArr, (err, res)=>{
    //     if (err) console.log(err);
    //     if (res) console.log("Insert Many Successfully!");
    // });
    // Query One (Find One)
    // dbo.collection("Profile").findOne({}, (err, res) => { // select * from profile limit 1
    //     console.log("Result from Find One is : ");
    //     console.log(res);
    //     console.log(res["hobby"]);
    // });
    // // Find Many
    // dbo.collection("Profile").find({}).toArray((err, res) => { // select * from profile
    //     console.log("Result from Find Many");
    //     console.log(res);
    // });
    // // Find with condition
    // var condition = {name: "Chanakarn"};
    // dbo.collection("Profile").find(condition).toArray((err, res) => {
    //     console.log("Result from Condition:");
    //     console.log(res);
    // });
});
  
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("login", { newListItem: items });
})

app.get("/home", (req, res) => {
    res.render("index", { newListItem: items });
})

app.post("/home", (req, res) => {
    // res.render("list", { newListItem: req.body.newItem})
    if (req.body.staple == "") {
        console.log("Value is null");
    } else {
        items.push(req.body.staple)
    }
    res.redirect("/home")
})

app.post("/delete", (req, res) => {
    const itemId = req.body.itemId;
    console.log(itemId);
    items.splice(itemId, 1);
    res.redirect("/home")
})

app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email);
    console.log(password);
    res.redirect("/home")
})

app.post("/signup", (req, res) => {
    const name = req.body.sname;
    const email = req.body.semail;
    const password = req.body.spassword;
    console.log(name);
    console.log(email);
    console.log(password);
    res.redirect("/")
})

app.post("/getrecipe", (req, res) => {
    const itemsString = items.join(",");
    console.log(itemsString);

    const url = 'https://api.edamam.com/api/recipes/v2?type=public&q=' + itemsString + '&app_id=830276f9&app_key=%20538988ed21c3c495f160142db5fb0df6';
    fetch(url)
        .then(response => response.text())
        .then(text => {
            const data = JSON.parse(text)
            res.render("recipe",{ foodList:data.hits});
        })
        .catch(error => {
            console.error("Error:", error);
            res.status(500).send("Error: " + error.message);
        });
});
app.use((req, res, next) => {
    res.status(404).send("Sorry, that page doesn't exist.");
});


app.listen(3000, () => {
    console.log("Server is running at port 3000");
})
