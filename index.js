const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
// U4ia3TRCTR9K4MR
const pass = "yrfgSbbbYOLRj1S5";
const val = "volunteerNetwork";

app.use(cors());
app.use(bodyParser.json());

const ObjectID = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://volunteerNetwork:yrfgSbbbYOLRj1S5@cluster0-shard-00-00.ibh58.mongodb.net:27017,cluster0-shard-00-01.ibh58.mongodb.net:27017,cluster0-shard-00-02.ibh58.mongodb.net:27017/volunteeringActivities?ssl=true&replicaSet=atlas-60jtz6-shard-0&authSource=admin&retryWrites=true&w=majority";
MongoClient .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
    console.log(err);
    console.log("done");

    // Event database
    const eventCollection = client.db("volunteeringActivities").collection("events");
    // All events
    app.post("/allEvents", (req, res) => {
        const newEvent = req.body;
        console.log(newEvent);
        eventCollection.insertMany(newEvent)
            .then(result => {
                console.log(result);
            })
    })

    // Admin insert event
    app.post("/newEvent", (req, res) => {
        const newEvent = req.body;
        console.log(newEvent);
        eventCollection.insertOne(newEvent)
        .then(result => {
            console.log(result);
            res.redirect("/");
        })
    })    
    // Show events
    app.get("/events", (req, res) => {
        eventCollection.find({})
        .toArray((err, document) => {
            res.send(document);
        })
    })

    // User database
    const userCollection = client.db("allVolunteer").collection("user");
    // Add User
    app.post("/addUser", (req,res) => {
        const newUser = req.body;
        console.log(newUser);
        userCollection.insertOne(newUser)
        .then(result => {
            console.log(result);
        })
    })
    console.log("done");

    // Show Current User
    app.get("/currentUser", (req,res)=> {
        console.log(req.query.email);
        userCollection.find({email: req.query.email})
        .toArray((err, document) => {
            res.send(document);
        })
    })

    // Admin Show All User
    app.get("/allUser", (req,res)=> {
        userCollection.find({})
        .toArray((err, document) => {
            res.send(document);
        })
    })

    app.delete("/delete/:id", (req, res) => {
        console.log(req.params.id)
        userCollection.deleteOne({_id: ObjectID(req.params.id)})
        .then((result) => {
            console.log(err);
            console.log(result);
            
            res.send(result.deletedCount > 0)
        })
    })
});



app.get("/", (req, res) => {
    res.send("listening");
})
app.listen(5000);