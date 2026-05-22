<<<<<<< HEAD
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
=======
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
// 🔐 CONFIGURAR TU GMAIL
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jflrsss0123@gmail.com",
    pass: "svxfekiimipfwulo"
  }
});

// 📩 ENVIAR CORREO AL PROVEEDOR
app.post("/enviar-faltante", async (req, res) => {

  const { proveedor, correo, descripcion, cantidad } = req.body;

  const mailOptions = {
    from: "Papelería Karol <TU_CORREO@gmail.com>",
    to: correo,
    subject: "Solicitud de surtido de producto",
    html: `
      <h2>Hola ${proveedor} 👋</h2>
      <p>Esperamos que se encuentre muy bien.</p>

      <p>Le solicitamos cordialmente el surtido del siguiente producto:</p>

      <h3>${descripcion}</h3>
      <h2>Cantidad solicitada: ${cantidad}</h2>

      <p>Quedamos atentos a su confirmación.</p>

      <br>
      <b>Papelería Karol</b>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error enviando correo");
  }
});
app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));
>>>>>>> 010daa3801c8cc8b88d59211d734fc9da42800cf
