const express = require("express");

const bodyParser = require("body-parser");

const app = express();

const http = require("https");
// For body-parser
app.use(express.urlencoded({
    extended: true
}));

// for custom css in the local directory, by creating a public directory directory for public file
app.use(express.static("public"));

app.get("/", function(req, res){
   res.sendFile(__dirname + "/signup.html");
    
})

app.post("/", function(reqq, ress){
    const first = reqq.body.first;
    const last = reqq.body.last;
    const mail = reqq.body.mail;
   // Javascript object required by mailchimp 
    const data = {
        members: [
            {
                email_address: mail,
                status: "subscribed",
                merge_fields: {
                    FNAME:first,
                    LNAME:last
                }
            }
        ]
    };
// we convert the data variable to a JSON
    const JSONdata = JSON.stringify(data);

    //https.request(url, option, function(){}); Format when u need to send a request to an external server.
    const url = "https://us6.api.mailchimp.com/3.0/lists/1af900145d";
    const options = {
        method: "POST",
        auth: "dave1:495cf48d8405c481175b95e916a759c0-us6"
    }
   

  const request =  http.request(url, options, function(res){
    if (res.statusCode === 200){
        ress.sendFile(__dirname + "/success.html");
    }
    else{
        ress.send(__dirname + "/failure.html");
    }
  
      res.on("data", function(data){
       var parseJSON = JSON.parse(data);
       console.log(parseJSON);
      })
    });


  
  request.write(JSONdata);
  request.end();

})

app.post("/failure", function(req, res){
    res.redirect("/");
})

// When deploying our website for example on heroku, we have to tap into something called "process.env.PORT" instead of the local port "3000". it allow us to work with their system.
// To allow us to also work simultaneously on our local host "3000" we add a or "||"
app.listen(process.env.PORT || 3000, function(){
    console.log("I am up and running");
});

//API KEY: 495cf48d8405c481175b95e916a759c0-us6

//List or Audience ID:
//Some plugins and integrations may request your Audience ID.Typically, this is what they want: 1af900145d.


