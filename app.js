const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();
const client = require("@mailchimp/mailchimp_marketing");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
})

client.setConfig({
    apiKey: "5167b2e63fa344f861d6a1579df559c5-us9",
    server: "us9",
});

app.post("/",function(req,res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    console.log(firstName,lastName,email);
    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    }
    const run = async () => {
        try {
          const response = await client.lists.addListMember("ff820c22cc", {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
              FNAME: subscribingUser.firstName,
              LNAME: subscribingUser.lastName
            }
          });
          console.log(response);
          res.sendFile(__dirname + "/success.html");
        } catch (err) {
          console.log(err.status);
          res.sendFile(__dirname + "/failure.html");
        }
    };
    run();
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000);

// API Key
// 5167b2e63fa344f861d6a1579df559c5-us9
//List ID
//ff820c22cc.