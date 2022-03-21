let canioMetal = 4500;
let soloRecablear = 2800;
let canioEmbutido = 3800;

const metal = document.getElementById("canioMetal");

metal.onclick = (e)=>{
    e.preventDefault();
    localStorage.setItem("precio",canioMetal);
    window.location.href = "./presupuesto.html";
}

const embutido = document.getElementById("canioEmbutido");

embutido.onclick = (e)=>{
    e.preventDefault();
    localStorage.setItem("precio",canioEmbutido);
    window.location.href = "./presupuesto.html";
}

const recablear = document.getElementById("recableado");

recablear.onclick = (e)=>{
    e.preventDefault();
    localStorage.setItem("precio",soloRecablear);
    window.location.href = "./presupuesto.html";
}