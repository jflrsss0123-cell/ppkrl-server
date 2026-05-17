function obtener(){
  return JSON.parse(localStorage.getItem("productos") || "[]");
}

function guardar(){
  let data = obtener();

  let obj = {
    codigo: document.getElementById("codigo").value.toUpperCase(),
    descripcion: document.getElementById("descripcion").value,
    proveedor: document.getElementById("proveedor").value,
    correo: document.getElementById("correo").value
  };

  data.push(obj);
  localStorage.setItem("productos", JSON.stringify(data));

  mostrar();
}

function mostrar(){

  let data = obtener();
  let cont = document.getElementById("lista");

  cont.innerHTML = "";

  data.forEach(p=>{
    cont.innerHTML += `<div>${p.codigo} - ${p.descripcion}</div>`;
  });
}

window.onload = mostrar;