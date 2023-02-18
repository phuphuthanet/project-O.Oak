const express = require('express');
const app = express();
const fetch = require('node-fetch');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');
const https = require('https')
var items = []
var alert = ""
var nameUser = ""

const uri = "mongodb+srv://phuthanet:18052001Phu@cluster0.00fi7bc.mongodb.net/myDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    if (err) console.log(err);
    else console.log("Database Connect Successfully!");
});


app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("login", { alert: alert });
})

app.get("/home", (req, res) => {
    res.render("index", { newListItem: items, user:nameUser });
})

app.post("/home", (req, res) => {
    if (req.body.staple == "") {
        console.log("Value is null");
    } else {
        items.push(req.body.staple)
    }
    res.redirect("/home")
})

app.post("/back", (req, res) => {
    res.redirect("/home")
})

app.get('/alert', (req, res) => {
    const message = "Invalid email or password";
    res.render('alert', { message: message });
});

app.post("/delete", (req, res) => {
    const itemId = req.body.itemId;
    items.splice(itemId, 1);
    res.redirect("/home")
})

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    client.connect((err) => {
        if (err) throw err;
        const db = client.db("myDB");
        const collection = db.collection("users");
        collection.findOne({ email: email, password: password }, (err, result) => {
            if (err) throw err;
            if (result) {
                alert = "Login successful"
                nameUser = result.name;
                console.log(alert);
                res.redirect("/home");
            } else {
                alert = "Invalid email or password"
                console.log(alert);
                res.redirect("/alert");
            }
        });
    });
});

app.post('/signup', (req, res) => {
    const name = req.body.sname;
    const email = req.body.semail;
    const password = req.body.spassword;

    client.connect((err) => {
        if (err) throw err;
        const db = client.db("myDB");
        const collection = db.collection("users");
        const document = { name: name, email: email, password: password };
        collection.insertOne(document, (err, result) => {
            if (err) throw err;
            console.log("Document inserted successfully");
            res.redirect("/");
        });
    });
});

app.post('/logout', (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/');
        }
      });
    } else {
      res.redirect('/');
    }
  });  
  
app.post("/getrecipe", (req, res) => {
    const itemsString = items.join(",");
    console.log(itemsString);

    const url = 'https://api.edamam.com/api/recipes/v2?type=public&q=' + itemsString + '&app_id=830276f9&app_key=%20538988ed21c3c495f160142db5fb0df6';
    fetch(url)
        .then(response => response.text())
        .then(text => {
            const data = JSON.parse(text)
            res.render("recipe", { foodList: data.hits });
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
