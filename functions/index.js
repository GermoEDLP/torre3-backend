
const functions = require("firebase-functions");

const nodemailer = require("nodemailer");
const express = require("express");
const cors = require("cors");

//Esto nos permite trabajar con variables d enetorno de firebase (aqui no las utilizamos)
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

//Defino nuestro sistema de envio
const app = express();

//Uso CORS para que no nos traben los sistemas de envio cruzado
app.use(cors({ origin: true }));

//Defino el tipo de envio, el root y la valides del mismo. Se puede trabajar un poco mejor con la validación
app.post("/", (req, res) => {
  const { body } = req;
  const isValidMessage = body.message && body.to && body.subject;

  if(!isValidMessage){
      return res.status(400).send({message: 'Datos incorrectos'});
  }

  //Empezamos a trabajar con el transportador de nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "mail.del.emisor@ejemplo.com",
            pass: "codigo_dado_por_gmail"
        }
    });

    //Opciones internas del mail
    const mailOptions = {
        from: "mail.del.emisor@ejemplo.com",
        to: body.to,
        subject: body.subject,
        text: body.message
    };

    //Desactivo las seguriades de la cuenta interna a las variables de entorno
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    //Realizo el envio y retorno cualquier mensaje de error
    transporter.sendMail(mailOptions, (err, data)=>{
        if(err){
            return res.status(500).send({message: 'error' + err.message});
        }

        return res.send({message: 'mensaje enviado'});
    })
});

//Exporto el modulo para poder subirlo a las functions de Firebase
module.exports.mailer = functions.https.onRequest(app);