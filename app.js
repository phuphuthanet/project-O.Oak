const express = require('express');
const app = express();
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const https = require('https')
var items = []
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("index", { newListItem: items });
})

app.post("/", (req, res) => {
    // res.render("list", { newListItem: req.body.newItem})
    if (req.body.staple == "") {
        console.log("Value is null");
    } else {
        items.push(req.body.staple)
    }
    res.redirect("/")
})

app.post("/delete", (req, res) => {
    const itemId = req.body.itemId;
    console.log(itemId);
    items.splice(itemId, 1);
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
