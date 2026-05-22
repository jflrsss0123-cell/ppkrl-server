function obtenerProveedores(){
  return JSON.parse(localStorage.getItem("proveedores") || "[]");
}

function guardarProveedor(){

  const nombre = document.getElementById("nombre").value.trim();
  const rfc = document.getElementById("rfc").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const direccion = document.getElementById("direccion").value.trim();

  const productosTexto = document.getElementById("productos").value;

  if(!nombre || !rfc){
    alert("Faltan datos importantes");
    return;
  }

  // 🔥 convierte texto a ARRAY automático
  const productosArray = productosTexto
    .split(",")
    .map(p => p.trim().toUpperCase())
    .filter(p => p !== "");

  const proveedor = {

  codigo:
  document
  .getElementById("codigoProveedor")
  .value
  .toUpperCase(),

  nombre,
  rfc,
  telefono,
  correo,
  direccion,
  productos: productosArray

};

  let data = obtenerProveedores();
  data.push(proveedor);

  localStorage.setItem("proveedores", JSON.stringify(data));

  alert("Proveedor guardado ✔");

  mostrarProveedores();
  limpiarFormulario();
}
function mostrarProveedores(){

  let data = obtenerProveedores();
  let cont = document.getElementById("listaProveedores");

  cont.innerHTML = "";

  data.forEach((p,i)=>{
    cont.innerHTML += `
      <div class="card">
        <b>${p.nombre}</b><br>
        RFC: ${p.rfc}<br>
        Tel: ${p.telefono}<br>
        Correo: ${p.correo}<br>
        Dirección: ${p.direccion}<br>
        Productos: ${p.productos.join(", ")}<br><br>

        <button onclick="eliminarProveedor(${i})">🗑️ Eliminar</button>
      </div>
    `;
  });
}
function limpiarFormulario(){
  document.getElementById("nombre").value = "";
  document.getElementById("rfc").value = "";
  document.getElementById("telefono").value = "";
  document.getElementById("correo").value = "";
  document.getElementById("direccion").value = "";
  document.getElementById("productos").value = "";
}
function eliminarProveedor(index){

  let data = obtenerProveedores();

  if(confirm("¿Eliminar proveedor?")){
    data.splice(index,1);
    localStorage.setItem("proveedores", JSON.stringify(data));
    mostrarProveedores();
  }
}