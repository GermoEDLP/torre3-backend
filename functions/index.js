
const functions = require("firebase-functions");

const nodemailer = require("nodemailer");
const express = require("express");
const cors = require("cors");

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}


exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
   });
   


const app = express();
app.use(cors({ origin: true }));

app.post("/", (req, res) => {
  const { body } = req;
  const isValidMessage = body.message && body.to && body.subject;

  if(!isValidMessage){
      return res.status(400).send({message: 'Datos incorrectos'});
  }
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "torretres.dev@gmail.com",
            pass: "azhnzlwmdlyxihfd"
        }
    });

    const mailOptions = {
        from: "torretres.dev@gmail.com",
        to: body.to,
        subject: body.subject,
        text: body.message
    };

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    transporter.sendMail(mailOptions, (err, data)=>{
        if(err){
            return res.status(500).send({message: 'error' + err.message});
        }

        return res.send({message: 'mensaje enviado'});
    })
});

module.exports.mailer = functions.https.onRequest(app);