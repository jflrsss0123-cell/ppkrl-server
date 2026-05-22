// ================= LOGIN =================

function login(){

    let usuario = document
        .getElementById("usuario")
        .value
        .trim()
        .toUpperCase();

    let password = document
        .getElementById("password")
        .value
        .trim();

    if(usuario === "LUIS ALFREDO" && password === "karol123"){

        document
            .getElementById("loginBox")
            .style.display = "none";

        document
            .getElementById("panelAdmin")
            .classList.remove("hidden");

        mostrarProductos();
        mostrarProveedores();

    }else{
        alert("❌ Acceso denegado");
    }
}

// ================= PRODUCTOS =================

function obtenerProductos(){
    return JSON.parse(
        localStorage.getItem("productos")
    ) || [];
}

function guardarProducto(){

    let codigo = document
        .getElementById("codigoProducto")
        .value
        .trim()
        .toUpperCase();

    let descripcion = document
        .getElementById("descripcionProducto")
        .value
        .trim();

    if(codigo === "" || descripcion === ""){
        alert("Completa todos los campos");
        return;
    }

    let productos = obtenerProductos();

    productos.push({
        codigo,
        descripcion
    });

    localStorage.setItem(
        "productos",
        JSON.stringify(productos)
    );

    alert("✅ Producto guardado");

    document.getElementById("codigoProducto").value = "";
    document.getElementById("descripcionProducto").value = "";

    mostrarProductos();
}

function mostrarProductos(){

    let lista = document.getElementById("listaProductos");

    let productos = obtenerProductos();

    lista.innerHTML = "";

    productos.forEach(p => {

        lista.innerHTML += `
            <div class="item">
                <b>${p.codigo}</b>
                <br>
                ${p.descripcion}
            </div>
        `;
    });
}

// ================= PROVEEDORES =================

function obtenerProveedores(){
    return JSON.parse(
        localStorage.getItem("proveedores")
    ) || [];
}

function guardarProveedor(){

  let codigo =
  document.getElementById("codigoProveedor")
  .value
  .toUpperCase();

  let empresa =
  document.getElementById("empresaProveedor")
  .value;

  let nombre =
  document.getElementById("nombreProveedor")
  .value;

  let rfc =
  document.getElementById("rfcProveedor")
  .value;

  let telefono =
  document.getElementById("telefonoProveedor")
  .value;

  let correo =
  document.getElementById("correoProveedor")
  .value;

  let direccion =
  document.getElementById("direccionProveedor")
  .value;

  let contrato =
  document.getElementById("contratoProveedor")
  .value;

  // VALIDAR PRODUCTO

  let productos = obtenerProductos();

  let existe = productos.find(
    p => p.codigo === codigo
  );

  if(!existe){

    alert(
      "❌ Ese código no existe. Verifica la información."
    );

    return;
  }

  let proveedores =
  JSON.parse(localStorage.getItem("proveedores"))
  || [];

  proveedores.push({

    codigo,
    empresa,
    nombre,
    rfc,
    telefono,
    correo,
    direccion,
    contrato

  });

  localStorage.setItem(
    "proveedores",
    JSON.stringify(proveedores)
  );

  alert("✅ Proveedor guardado");

  mostrarProveedores();
}

function mostrarProveedores(){

  let proveedores =
  JSON.parse(localStorage.getItem("proveedores"))
  || [];

  let lista =
  document.getElementById("listaProveedores");

  lista.innerHTML = "";

  proveedores.forEach(p=>{

    lista.innerHTML += `

    <div class="item">

      <h3>${p.empresa}</h3>

      <b>Contacto:</b>
      ${p.nombre}
      <br>

      <b>Código:</b>
      ${p.codigo}
      <br>

      <b>RFC:</b>
      ${p.rfc}
      <br>

      <b>Teléfono:</b>
      ${p.telefono}
      <br>

      <b>Correo:</b>
      ${p.correo}
      <br>

      <b>Dirección:</b>
      ${p.direccion}
      <br>

      <b>Contrato:</b>
      ${p.contrato}

    </div>

    `;

  });

}
// ================= PRODUCTOS =================

function obtenerProductos(){
  return JSON.parse(localStorage.getItem("productos")) || [];
}

function buscarProducto(codigo){

  let productos = obtenerProductos();

  return productos.find(
    p => p.codigo === codigo
  );
}

// ================= AUTOLLENADO =================

window.addEventListener("DOMContentLoaded",()=>{

  let input = document.getElementById("codigoFaltante");

  if(input){

    input.addEventListener("input",()=>{

      let codigo = input.value.toUpperCase();

      let producto = buscarProducto(codigo);

      if(producto){

        document.getElementById("descripcionArticulo").value =
        producto.descripcion;

       let proveedores =
JSON.parse(localStorage.getItem("proveedores"))
|| [];

let proveedor = proveedores.find(
  p =>
    p.codigo &&
    p.codigo.toUpperCase() === codigo.toUpperCase()
);
if(proveedor){

  document.getElementById(
    "nombreProveedor"
  ).value =
  proveedor.empresa || proveedor.nombre;

  document.getElementById(
    "correoProveedor"
  ).value =
  proveedor.correo || "";

}else{

  document.getElementById(
    "nombreProveedor"
  ).value = "";

  document.getElementById(
    "correoProveedor"
  ).value = "";
}
{

  document.getElementById(
    "nombreProveedor"
  ).value = "Sin proveedor";

  document.getElementById(
    "correoProveedor"
  ).value = "Sin correo";

}
      }else{

        document.getElementById("descripcionArticulo").value = "";
        document.getElementById("nombreProveedor").value = "";
        document.getElementById("correoProveedor").value = "";

      }

    });

  }

});

// ================= REGISTRAR FALTANTE =================

async function registrarFaltante(){

  let codigo =
  document.getElementById("codigoFaltante").value.toUpperCase();

  let cantidad =
  document.getElementById("cantidadFaltante").value;

  let producto = buscarProducto(codigo);

  if(!producto){
    alert("Código no encontrado");
    return;
  }

  const datos = {
    proveedor: producto.proveedor,
    correo: producto.correo,
    descripcion: producto.descripcion,
    cantidad
  };

  try{

    let res = await fetch(
      "https://ppkrl-server.onrender.com/enviar-correo",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(datos)
      }
    );

    let data = await res.json();

    if(data.ok){

      document.getElementById("mensajeFaltante")
      .innerText =
      "Correo enviado correctamente ✅";

    }else{

      document.getElementById("mensajeFaltante")
      .innerText =
      "Error enviando correo ❌";

    }

  }catch(err){

    document.getElementById("mensajeFaltante")
    .innerText =
    "Servidor desconectado ❌";

  }

}