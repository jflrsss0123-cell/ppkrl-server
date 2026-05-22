const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   CONFIGURAR CORREO
========================= */

const transporter = nodemailer.createTransport({

  service:"gmail",

  auth:{
    user:"jflrsss0123@gmail.com",
    pass:"fuoqtnoezdcpwurg"
  }

});

/* =========================
   RUTA ENVIAR CORREO
========================= */

app.post("/enviar-correo", async(req,res)=>{

  try{

    const {
      proveedor,
      correo,
      descripcion,
      cantidad
    } = req.body;

    await transporter.sendMail({

      from:"Papelerias Karol <TU_CORREO@gmail.com>",

      to:correo,

      subject:"Solicitud de surtido",

      html:`

      <h2>Hola ${proveedor}</h2>

      <p>
      Esperamos que se encuentre bien.
      </p>

      <p>
      Tenemos faltante del siguiente producto:
      </p>

      <ul>
        <li>
        <b>Producto:</b>
        ${descripcion}
        </li>

        <li>
        <b>Cantidad:</b>
        ${cantidad}
        </li>
      </ul>

      <p>
      Agradecemos su apoyo para surtirlo.
      </p>

      <br>

      <b>
      Saludos cordiales
      <br>
      Papelerías Karol
      </b>

      `

    });

    res.json({
      ok:true
    });

  }catch(error){

    console.log(error);

    res.json({
      ok:false,
      error:error.message
    });

  }

});

/* =========================
   SERVIDOR
========================= */

app.listen(3000, ()=>{

  console.log(
    "Servidor funcionando en puerto 3000"
  );

});