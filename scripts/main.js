// Proyecto Final JavaScript Coderhouse
// Profesor: Adrian Gonzalez
// Tutora: Carla Montani
// Alumno: Francisco Zuidwijk
//----------------------------------------------------------------------------------------------
// Declaro variables globales

let totalizador;
let precioTotal;
let precioEnUsd;
let listaAmbientes = []
let containerFormulario;
let containerBoton;
let boton;
//Como son precios diferentes, la pagina index guarda el precio en el localstorage y lo recupero en la pagina presupuesto
let precioBoca = parseInt(localStorage.getItem("precio")); 
let tipoDeTrabajo = localStorage.getItem("trabajo");
let containerAmbientes; // contenedor de id="container-ambientes"
let form1; // formulario que va estar dentro de containerAmbientes
let listaRecuperadaJson = localStorage.getItem("listaAmbientes"); // Recupera LocalStorage

class Ambiente {
    constructor(literal) {
        this.id = listaAmbientes.length;
        this.nombre = literal.nombre;
        this.tug = literal.tug; 
        this.luz = literal.luz; 
        this.tue = literal.tue;
     }
}
//Function que hace un pedido GET a un API que da las cotizaciones.
let dolarPesos;
const pedirCotizacion = async () => {
  const resp = await fetch('https://v6.exchangerate-api.com/v6/e691df072cccfde90a8a1472/latest/USD');
  const data = await resp.json();
  dolarPesos = data.conversion_rates.ARS;// recupero el de USD-ARS
}
pedirCotizacion();

// Boton que muestra informe de local storage si es que hay datos guardados
let botonRecupera = document.getElementById("recupera"); 
listaRecuperadaJson != null? botonRecupera.classList.remove("esconder"): botonRecupera.classList.add("esconder");
botonRecupera.onclick = () =>{
    muestraInformeRecuperado();
}

muestraTipoTrabajo(tipoDeTrabajo);
formularioAmbientes();


// Creo el formulario que pide que ingrese la cantidad de ambientes
function formularioAmbientes(){
    containerAmbientes = document.getElementById("container-ambientes");
    form1 = document.createElement("form");
    let entrada = document.createElement("input");
    entrada.setAttribute("type","number");
    entrada.setAttribute("required","requiered");
    entrada.setAttribute("min","1"); // Para que no se pueda ingresar cero o negativos
    entrada.setAttribute("placeholder","Cantidad Ambientes");
    entrada.classList.add("entradas");
    let boton = document.createElement("input");
    boton.setAttribute("type","submit");
    boton.classList.add("btn","btn-dark","btn-sm");
    containerAmbientes.appendChild(form1);
    form1.appendChild(entrada);
    form1.appendChild(boton);
    form1.onsubmit = (e) =>{
        e.preventDefault();
        let aux = e.target;
        let cantAmbientes = parseInt(aux[0].value);
        containerAmbientes.removeChild(form1); // Para esconder el boton una vez clickeado
            iniciarFormulario(cantAmbientes) // llamo la funcion para iniciar la carga del formulario 
    }
}

// funcion que crea el formulario para el ingreso de datos
function iniciarFormulario(cantAmbientes){
    containerFormulario = document.getElementById("container-formulario");  
    let parrafo1 = document.createElement("p");
    parrafo1.innerHTML = `Ingrese los datos por fila y clickee en el boton "Enviar"`;
    containerFormulario.appendChild(parrafo1);
    creaInputs(cantAmbientes);
    crearInforme();
}

//Crea el boton y el listener para hacer el informe
function crearInforme(){
    containerBoton = document.getElementById("container-boton");
    boton = document.createElement("button");
    boton.innerHTML =`<button class="btn btn-outline-dark">Obtenga su presupuesto</button>`;
    containerBoton.appendChild(boton);
    boton.classList.add("entradas");
    boton.onclick = () =>{
        calculaTotales();
        calculoPrecioTotal(); // llamo la funcion que calcula el precio
        iniciaInforme(); // llamo para que muestre el informe   
    }
}

// Funcion que suma todas las bocas de cada objeto Ambiente
function calculaTotales(){
    let tugs = listaAmbientes.map( (el) => parseInt(el.tug)); // los parseo porque me devuelve string
    let luz = listaAmbientes.map( (el) => parseInt(el.luz));
    let tue = listaAmbientes.map( (el)=> parseInt(el.tue));
    let totalTomas = tugs.reduce ((suma, item)=> suma + item, 0);
    let totalLuces = luz.reduce ((suma,item)=> suma + item,0);
    let totalTomasEspeciales = tue.reduce((suma,item)=> suma+item,0);
    totalizador = totalTomas + (totalLuces*1.25) +  (totalTomasEspeciales * 2);
}

function calculoPrecioTotal(){
    precioTotal = totalizador * precioBoca;
    precioEnUsd = precioTotal/(dolarPesos*1.65); // Tomo en cuenta el impuesto del 65% a la compra de USD
}

// Function que muestra los datos y le agrega una clase display:none al formulario asi lo esconde
function iniciaInforme(){
    let escondeDatos = document.getElementById("container-datos");
    escondeDatos.classList.add("esconder");
    const DateTime = luxon.DateTime; // Uso LUXON para las fechas
    const fechaActual = DateTime.now();
    let containerInforme = document.getElementById("container-informe");
    let textoInforme = document.createElement("h6");
    textoInforme.innerHTML = `<h6>Le adjuntamos nuestra propuesta para hacer la instalaci??n el??ctrica de su casa.</h6>
    <h6>Esto es a t??tulo informativo, para que usted tenga una referencia de los costos.</h6> <h5><strong> El costo total es de $ ${precioTotal.toLocaleString()} Pesos Argentinos</strong></h5>
    <h5><strong>Equivalente a ${Math.trunc(precioEnUsd)} USD</strong></h5>
    <h6><input type="button" value="Reiniciar" onclick="location.href ='index.html';" class="btn btn-dark "/> </h6>
    <p>Con el boton reiniciar y recuperar informe puede comparar otras opciones`; 
    let fecha = document.createElement("p");
    fecha.innerText = `Ciudad Autonoma de Buenos Aires,  ${fechaActual.toLocaleString(DateTime.DATE_FULL)}`;
    containerInforme.appendChild(fecha);
    containerInforme.appendChild(textoInforme);
    guardaEnStorage();
    muestraTablaStorage(listaAmbientes)
}


// Es la funcion que crea cada input de acuerdo a la cantidad de ambientes que ingreso usuario
function creaInputs(cantAmbientes){
    
    containerFormulario = document.getElementById("container-formulario")
    const formulario = document.createElement("form");
    formulario.classList.add("contenedor-inputs")
    const selectAmbientes = document.createElement("select");
    selectAmbientes.classList.add("entradas");
    let textoSelect = `<option>Living</option><option>Comedor</option><option>Cocina</option><option>Ba??o-1</option><option>Dormitorio-1</option><option>Ba??o-2</option><option>Dormitorio-2</option><option>Ba??o-3</option><option>Dormitorio-3</option><option>Ba??o-4</option><option>Dormitorio-4</option><option>Otros</option>`
    selectAmbientes.innerHTML = textoSelect;

    const inputTomas = document.createElement("input");
    inputTomas.setAttribute("id","tug");
    inputTomas.setAttribute("type","number");
    inputTomas.setAttribute("min","0");
    inputTomas.setAttribute("placeholder","Tomacorrientes");
    inputTomas.setAttribute("required","true");
    inputTomas.classList.add("entradas");
    let iconoTomas = document.createElement("span"); //Creo Span para insertar icono
    iconoTomas.innerHTML = `<ion-icon name="flash-outline"></ion-icon>`
   
    const inputLuz = document.createElement("input");
    inputLuz.setAttribute("id","luz");
    inputLuz.setAttribute("type","number");
    inputLuz.setAttribute("min","0");
    inputLuz.setAttribute("placeholder","Luces");
    inputLuz.setAttribute("required","true");
    inputLuz.classList.add("entradas");
    let iconoLuz = document.createElement("span"); //Creo Span para insertar icono
    iconoLuz.innerHTML = `<ion-icon name="bulb-outline"></ion-icon>`

    const inputTue = document.createElement("input");
    inputTue.setAttribute("id","tue");
    inputTue.setAttribute("type","number");
    inputTue.setAttribute("min","0");
    inputTue.setAttribute("placeholder","Tomas Especiales");
    inputTue.setAttribute("required","true");
    inputTue.classList.add("entradas");
    let iconoTue = document.createElement("span"); //Creo Span para insertar icono
    iconoTue.innerHTML = `<ion-icon name="snow-outline"></ion-icon`

    const enviar = document.createElement("input");
    enviar.setAttribute("type","submit");

    formulario.appendChild(selectAmbientes);
    formulario.appendChild(iconoTomas);
    formulario.appendChild(inputTomas);
    formulario.appendChild(iconoLuz);
    formulario.appendChild(inputLuz);
    formulario.appendChild(iconoTue);
    formulario.appendChild(inputTue);
    formulario.appendChild(enviar);
    containerFormulario.appendChild(formulario);
    let containerMensaje = document.getElementById("container-mensaje");
    let tug = document.querySelector("#tug");
    let luz = document.querySelector("#luz");
    let tue = document.querySelector("#tue");

    let cont = 1;   //Contador que registra la cantidad de ambientes ingresados
     formulario.onsubmit = (e) => {
        cont >= cantAmbientes && enviar.classList.add("esconder") // Deshabilita Boton cuando ingreso todos
        e.preventDefault();
        const inputs = e.target.children;
         //Aca construye el objeto y lo pushea en un array
        listaAmbientes.push(new Ambiente({ nombre: inputs[0].value, tug: tug.value, luz: luz.value, tue: tue.value }));
        // Se agrego un Toastify
            Toastify({
                text: `${inputs[0].value} Ingresado`,
                duration: 6000,
                position: `left`,
                className: `toastify`,
                style: {
                    background: 'linear-gradient(to right, #5f291d, #1a1a11)'
                }
            }).showToast();
            formulario.reset(); // para que los valores vuelvan a cero
            cont == 1 && creaTabla(); //Para que muestre el encabezado y no lo repita despues en cada ciclo
            console.log(listaAmbientes[listaAmbientes.length-1]);
            agregaFilaTabla(listaAmbientes[listaAmbientes.length-1]);
            cont +=1; 
        }
    
}


// Esta function guarda el array en el localStorage
function guardaEnStorage(){
    listaAmbientes.length != 0 && localStorage.setItem("listaAmbientes",JSON.stringify(listaAmbientes));
}

 // Esta funcion recupera del storage el array de objetos listaAmbientes y los totales
function recuperoInforme(){
    listaRecuperadaJson != null ? recuperaDatos() :location.reload() ; //Operador Ternario
    function recuperaDatos(){
        listaAmbientes = JSON.parse(listaRecuperadaJson);
        calculaTotales();
    }
}

// esta funcion muestra el informe de nuevo, desde el archivo recuperado de localStorage
function muestraInformeRecuperado(){
    recuperoInforme();
    calculoPrecioTotal(); // llamo la funcion que calcula el precio
    iniciaInforme(); // llamo para que muestre el informe 
}


// Function que crea la tabla
const tabla = document.createElement("table");
function creaTabla(){
    let containerTabla = document.getElementById("container-tabla")
    tabla.classList.add("table","container","table-striped", "table-bordered", "border-dark", "w-50", "text-center");
    const encabezado = document.createElement("tr");
    encabezado.innerHTML =`<th scope="col">Ambiente</th><th scope="col">Tomas comunes</th><th scope="col">Luces</th><th scope="col">Tomas Especiales</th>`
    tabla.appendChild(encabezado);
    containerTabla.appendChild(tabla);
}

function agregaFilaTabla(lista){ // recibe como parametro el ultimo objeto ambiente ingresado
    const fila = document.createElement("tr");
    fila.innerHTML = `<th scope="row">${lista.nombre}</th><td>${lista.tug}</td><td>${lista.luz}</td><td>${lista.tue}</td>`
    tabla.appendChild(fila);
}

function muestraTablaStorage(listaGuardado){
    const tablaStorage = document.createElement("table");
    let containerTablaGuardada = document.getElementById("tabla-guardada")
    tablaStorage.classList.add("table","container","table-striped", "table-bordered", "border-dark", "w-50", "text-center");
    const encabezado = document.createElement("tr");
    encabezado.innerHTML =`<th scope="col">Ambiente</th><th scope="col">Tomas comunes</th><th scope="col">Luces</th><th scope="col">Tomas Especiales</th>`
    tablaStorage.appendChild(encabezado);
    containerTablaGuardada.appendChild(tablaStorage);
    listaGuardado.forEach(element => {
        const fila = document.createElement("tr");
        fila.innerHTML = `<th scope="row">${element.nombre}</th><td>${element.tug}</td><td>${element.luz}</td><td>${element.tue}</td>`
        tablaStorage.appendChild(fila);
    });
}

function muestraTipoTrabajo(mostrarTrabajo){
    let titulo2 = document.getElementById("tipo-trabajo");
    let trabajo = document.createElement("h2")
    trabajo.innerHTML = mostrarTrabajo;
    titulo2.appendChild(trabajo);
}
                     