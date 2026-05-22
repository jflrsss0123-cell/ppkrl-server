// ================= SAFE STORAGE =================

function obtenerProductos(){
  return JSON.parse(localStorage.getItem("productos") || "[]");
}

function guardarProductos(lista){
  localStorage.setItem("productos", JSON.stringify(lista));
}

function obtenerProveedores(){
  return JSON.parse(localStorage.getItem("proveedores") || "[]");
}

function guardarProveedores(lista){
  localStorage.setItem("proveedores", JSON.stringify(lista));
}
function buscarProductoPorCodigo(codigo){
  return obtenerProductos().find(p => p.codigo === codigo);
}
window.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("codigoFaltante");
  if(!input) return;

  input.addEventListener("input", () => {

    const producto = buscarProductoPorCodigo(input.value.toUpperCase());

    if(producto){
      descripcionArticulo.value = producto.descripcion;
      nombreProveedor.value = producto.proveedor;
      correoProveedor.value = producto.correo;
    } else {
      descripcionArticulo.value = "";
      nombreProveedor.value = "";
      correoProveedor.value = "";
    }
  });
});
window.registrarFaltante = async function(){

  const codigo = document.getElementById("codigoFaltante").value.toUpperCase();
  const cantidad = document.getElementById("cantidadFaltante").value;

  const producto = buscarProductoPorCodigo(codigo);

  if(!producto){
    document.getElementById("mensajeFaltante").innerText = "Código no existe";
    return;
  }

  if(!cantidad || cantidad <= 0){
    document.getElementById("mensajeFaltante").innerText = "Cantidad inválida";
    return;
  }

  // 🔥 GUARDAR EN HISTORIAL LOCAL
  const faltante = {
    codigo,
    descripcion: producto.descripcion,
    proveedor: producto.proveedor,
    correo: producto.correo,
    cantidad,
    fecha: new Date().toLocaleString()
  };

  let historial = JSON.parse(localStorage.getItem("historialFaltantes") || "[]");
  historial.push(faltante);
  localStorage.setItem("historialFaltantes", JSON.stringify(historial));

  // 🔥 AQUI ESTA LA MAGIA — ENVIAR AL SERVER
  try {
    await fetch("http://localhost:3000/enviar-faltante", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        proveedor: producto.proveedor,
        correo: producto.correo,
        descripcion: producto.descripcion,
        cantidad: cantidad
      })
    });

    document.getElementById("mensajeFaltante").innerText =
      "Faltante registrado y correo enviado ✔";

  } catch (error) {
    document.getElementById("mensajeFaltante").innerText =
      "Se guardó el faltante pero falló el correo ⚠";
  }

  limpiarFaltante();
}
 
{
  limpiarFaltante();
}
function limpiarFaltante(){

  document.getElementById("codigoFaltante").value = "";
  document.getElementById("descripcionArticulo").value = "";
  document.getElementById("nombreProveedor").value = "";
  document.getElementById("correoProveedor").value = "";
  document.getElementById("cantidadFaltante").value = "";

}
window.guardarProveedor = function(){

  const nombre = provNombre.value.trim();
  const rfc = provRFC.value.trim();
  const telefono = provTelefono.value.trim();
  const correo = provCorreo.value.trim();
  const direccion = provDireccion.value.trim();
  const codigoProducto = provProductos.value.toUpperCase().trim();

  if(nombre === ""){
    alert("Escribe el nombre del proveedor");
    return;
  }

  // 🔎 VALIDAR QUE EL CODIGO EXISTA EN PRODUCTOS
  const producto = buscarProductoPorCodigo(codigoProducto);

  if(!producto){
    alert("❌ CODIGO NO EXISTE EN PRODUCTOS");
    return;
  }

  const proveedores = obtenerProveedores();

  const nuevoProveedor = {
    nombre,
    rfc,
    telefono,
    correo,
    direccion,
    productos:[codigoProducto] // 🔥 ahora SIEMPRE es ARRAY
  };

  proveedores.push(nuevoProveedor);
  guardarProveedores(proveedores);

  alert("Proveedor guardado ✔");
  limpiarProveedor();
  mostrarProveedores();
}
function limpiarProveedor(){
  provNombre.value="";
  provRFC.value="";
  provTelefono.value="";
  provCorreo.value="";
  provDireccion.value="";
  provProductos.value="";
}
function mostrarProveedores(){

  const cont = document.getElementById("listaProveedores");
  if(!cont) return;

  const proveedores = obtenerProveedores();
  cont.innerHTML = "";

  if(proveedores.length === 0){
    cont.innerHTML = "<p>No hay proveedores guardados</p>";
    return;
  }

  proveedores.forEach(p => {

    // 🔥 SI ES TEXTO LO CONVERTIMOS A ARRAY (compatibilidad vieja data)
    let productos = Array.isArray(p.productos) ? p.productos.join(", ") : p.productos;

    cont.innerHTML += `
      <div class="card">
        <b>${p.nombre}</b><br>
        RFC: ${p.rfc}<br>
        Tel: ${p.telefono}<br>
        Correo: ${p.correo}<br>
        Dirección: ${p.direccion}<br>
        Productos: ${productos}
      </div>
    `;
  });
}
function mostrarProductos(){
  const cont = document.getElementById("listaProductos");
  if(!cont) return;

  const productos = obtenerProductos();
  cont.innerHTML="";

  productos.forEach(p=>{
    cont.innerHTML += `
      <div class="card">
        <b>${p.codigo}</b><br>
        ${p.descripcion}<br>
        Proveedor: ${p.proveedor}
      </div>
    `;
  });
}
window.mostrarFormulario = function(){
  formProveedor.classList.remove("oculto");
  listaPanel.classList.add("oculto");
}

window.mostrarLista = function(){
  listaPanel.classList.remove("oculto");
  formProveedor.classList.add("oculto");
  mostrarProveedores();
}
window.addEventListener("load", ()=>{
  mostrarProveedores();
  mostrarProductos();
});
function mostrarHistorial(){

  const cont = document.getElementById("historial");
  if(!cont) return;

  const historial = JSON.parse(localStorage.getItem("historialFaltantes") || "[]");

  cont.innerHTML = "";

  historial.forEach(f=>{
    cont.innerHTML += `
      <div class="card">
        <b>${f.descripcion}</b><br>
        Cantidad: ${f.cantidad}<br>
        Proveedor: ${f.proveedor}<br>
        Fecha: ${f.fecha}
      </div>
    `;
  });
}

window.addEventListener("load", mostrarHistorial);
let carrito = [];

function toggleCart(){
  document.getElementById("cartPanel").classList.toggle("open");
}

function pagar(){
  alert("Pago simulado ✔");
}

function apartar(){
  alert("Pedido apartado ✔");
}

function ir(pagina){
  window.location.href = pagina;
}
let clicksAdmin = 0;
const secreto =
document.getElementById("secretAdmin");

if(secreto){

  let clicks = 0;

  secreto.addEventListener("click",()=>{

    clicks++;

    if(clicks >= 4){

      window.location.href =
      "admin.html";

    }

  });

}

    clicksAdmin++;

    if(clicksAdmin >= 4){
        window.location.href = "admin.html";
    }

    setTimeout(()=>{
        clicksAdmin = 0;
    },2000);


 function ocultarTodo(){

  document
  .querySelectorAll(".adminSection")
  .forEach(sec=>{
    sec.classList.add("hidden");
  });

}

function mostrarSeccion(id){

  ocultarTodo();

  document
  .getElementById(id)
  .classList.remove("hidden");

}

function volverInicio(){

  ocultarTodo();

}