let canioMetal = 4500;
let soloRecablear = 2800;
let canioEmbutido = 3800;

const metal = document.getElementById("canioMetal");

metal.onclick = (e)=>{
    e.preventDefault();
    localStorage.setItem("precio",canioMetal);
    localStorage.setItem("trabajo","Para caño metalico a la vista ")
    window.location.href = "./presupuesto.html";
}

const embutido = document.getElementById("canioEmbutido");

embutido.onclick = (e)=>{
    e.preventDefault();
    localStorage.setItem("precio",canioEmbutido);
    localStorage.setItem("trabajo","Para caño corrugado embutido")
    window.location.href = "./presupuesto.html";
}

const recablear = document.getElementById("recableado");

recablear.onclick = (e)=>{
    e.preventDefault();
    localStorage.setItem("precio",soloRecablear);
    localStorage.setItem("trabajo","Para recablear todo nuevo")
    window.location.href = "./presupuesto.html";
}