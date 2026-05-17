// ===== USUARIOS PERMITIDOS =====
const usuarios = ["LUIS ALFREDO","JUAN PABLO","JORGE ALAN"];
const password = "karol123";

// ================= LOGIN =================
function login(){
  let usuario = document.getElementById("user").value.trim().toUpperCase();
  let pass = document.getElementById("pass").value.trim();

  if(usuarios.includes(usuario) && pass === password){
    document.querySelector(".login").style.display="none";
    document.getElementById("panel").classList.remove("hidden");
  } else {
    alert("Usuario o contraseña incorrectos");
  }
}

// ================= BASE DE DATOS LOCAL =================

// PROVEEDORES
function obtenerProveedores(){
  return JSON.parse(localStorage.getItem("proveedores")) || [];
}

function guardarProveedores(lista){
  localStorage.setItem("proveedores", JSON.stringify(lista));
}

// PRODUCTOS
function obtenerProductos(){
  return JSON.parse(localStorage.getItem("productos")) || [];
}

function guardarProductos(lista){
  localStorage.setItem("productos", JSON.stringify(lista));
}

function buscarProductoPorCodigo(codigo){
  let productos = obtenerProductos();
  return productos.find(p => p.codigo === codigo);
}

// ================= REGISTRAR PROVEEDOR =================
function registrarProveedor(){

  const proveedor = {
    nombre: document.getElementById("provNombre").value.toUpperCase(),
    rfc: document.getElementById("provRFC").value.toUpperCase(),
    telefono: document.getElementById("provTelefono").value,
    correo: document.getElementById("provCorreo").value,
    direccion: document.getElementById("provDireccion").value,
    productos: document.getElementById("provProductos").value.toUpperCase().split(",")
  };

  if(!proveedor.nombre){
    alert("Ingresa nombre del proveedor");
    return;
  }

  let proveedores = obtenerProveedores();
  proveedores.push(proveedor);
  guardarProveedores(proveedores);

  alert("Proveedor guardado correctamente ✅");
}

// ================= REGISTRAR PRODUCTO =================
function registrarProducto(){

  const codigo = document.getElementById("prodCodigo").value.toUpperCase();
  const descripcion = document.getElementById("prodDescripcion").value;
  const proveedorNombre = document.getElementById("prodProveedor").value.toUpperCase();

  let proveedores = obtenerProveedores();
  let proveedor = proveedores.find(p => p.nombre === proveedorNombre);

  if(!proveedor){
    alert("Ese proveedor no existe");
    return;
  }

  const producto = {
    codigo: codigo,
    descripcion: descripcion,
    proveedor: proveedor.nombre,
    correo: proveedor.correo
  };

  let productos = obtenerProductos();
  productos.push(producto);
  guardarProductos(productos);

  alert("Producto guardado y ligado al proveedor ✅");
}

// ================= AUTOLLENADO POR CÓDIGO =================
window.addEventListener("DOMContentLoaded", () => {

  const inputCodigo = document.getElementById("codigoFaltante");

  if (inputCodigo) {
    inputCodigo.addEventListener("input", function () {

      const codigo = this.value.toUpperCase();
      const producto = buscarProductoPorCodigo(codigo);

      if (producto) {
        document.getElementById("descripcionArticulo").value = producto.descripcion;
        document.getElementById("nombreProveedor").value = producto.proveedor;
        document.getElementById("correoProveedor").value = producto.correo;
      } else {
        document.getElementById("descripcionArticulo").value = "";
        document.getElementById("nombreProveedor").value = "";
        document.getElementById("correoProveedor").value = "";
      }
    });
  }
});

// ================= REGISTRAR FALTANTE =================
async function registrarFaltante(){

  const codigo = document.getElementById("codigoFaltante").value.toUpperCase();
  const cantidad = document.getElementById("cantidadFaltante").value;
  const producto = buscarProductoPorCodigo(codigo);

  if (!producto) {
    document.getElementById("mensajeFaltante").innerText = "Ese código no existe";
    return;
  }

  if (!cantidad || cantidad <= 0) {
    document.getElementById("mensajeFaltante").innerText = "Ingresa una cantidad válida";
    return;
  }

  const faltante = {
    codigo: codigo,
    descripcion: producto.descripcion,
    proveedor: producto.proveedor,
    correo: producto.correo,
    cantidad: cantidad,
    fecha: new Date().toLocaleString()
  };

  // GUARDAR HISTORIAL LOCAL
  let historial = JSON.parse(localStorage.getItem("historialFaltantes")) || [];
  historial.push(faltante);
  localStorage.setItem("historialFaltantes", JSON.stringify(historial));

  // 💌 ENVIAR AL SERVIDOR
  try {
    const res = await fetch("http://localhost:3000/enviar-faltante", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        proveedor: faltante.proveedor,
        correo: faltante.correo,
        descripcion: faltante.descripcion,
        cantidad: faltante.cantidad
      })
    });

    const data = await res.json();

    if(data.ok){
      document.getElementById("mensajeFaltante").innerText =
        "Faltante registrado y correo enviado 📧✔";
    }else{
      document.getElementById("mensajeFaltante").innerText =
        "Se guardó pero el correo falló 😢";
    }

  } catch (error) {
    document.getElementById("mensajeFaltante").innerText =
      "Error conectando con el servidor ❌";
  }

  limpiarFaltante();
}

// ================= LIMPIAR FORMULARIO =================
function limpiarFaltante(){
  document.getElementById("codigoFaltante").value = "";
  document.getElementById("descripcionArticulo").value = "";
  document.getElementById("nombreProveedor").value = "";
  document.getElementById("correoProveedor").value = "";
  document.getElementById("cantidadFaltante").value = "";
}