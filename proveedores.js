function obtener(){
  return JSON.parse(localStorage.getItem("proveedores") || "[]");
}

function guardarProveedor(){

  let data = obtener();

  let obj = {
    nombre: document.getElementById("nombre").value,
    rfc: document.getElementById("rfc").value,
    telefono: document.getElementById("telefono").value,
    correo: document.getElementById("correo").value,
    direccion: document.getElementById("direccion").value
  };

  data.push(obj);
  localStorage.setItem("proveedores", JSON.stringify(data));

  mostrar();
}

function mostrar(){

  let data = obtener();
  let cont = document.getElementById("listaProveedores");

  cont.innerHTML = "";

  data.forEach(p=>{
    cont.innerHTML += `<div>${p.nombre} - ${p.correo}</div>`;
  });
}

window.onload = mostrar;