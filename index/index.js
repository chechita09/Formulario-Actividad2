const { ipcRenderer } = require('electron')
const formulario = document.getElementById('formulario')
const inputs = document.querySelectorAll('#formulario input') //Guardar los inputs en un arreglo


const expresiones = {
    usuario: /^[a-zA-Z0-9\_\-]{4,20}$/,
    nombres: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    numeros: /[0-9]/,
    minusculas: /[a-z]/,
    mayusculas: /[A-Z]/,
    simbolo: /[\.\?\\\_\-]/,
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    fecha: /(19|20)\d{2}[-](0?[1-9]|1[0-2])[-](0?[1-9]|[12]\d|3[01])$/
}
//Validación para submit se envia formulario si todos los atributos son true
const campos = {
    user: false,
    name: false,
    lastName: false,
    email: false,
    date: false,
    password: false,
}

//Esta funcion sirve para fijar fecha máxima permitida en el datePicker, no se permiten fechas posteriores.
const fechaInput = document.getElementById('date')
const fechaHoy = new Date()
const fechaFormateada = (fecha) =>{
    let dia = fecha.getDate(),
    mes = fecha.getMonth() <= 1 ? '0'+ (fecha.getMonth()+1) : fecha.getMonth(),
    anio = fecha.getFullYear()
    return String(anio+'-'+mes+'-'+dia)
}
const valorFechaHoy = fechaFormateada(fechaHoy)
fechaInput.setAttribute('max', valorFechaHoy)   

let usuarioUsado = false; // Esta variable determina si el nombre de usuario está siendo utilizado

// Si el nombre de usuario está siendo utilizado se muestra un mensaje que dice que no está disponible
function usuarioDisponible(respuesta) {    
    document.getElementById('mensajeError-user').innerHTML = ''
    campos.user = false
    if(respuesta) {
        document.getElementById('user').classList.add('campoInvalido')
        document.getElementById('mensajeError-user').classList.add('mostrar')
        document.getElementById('mensajeError-user').innerHTML += 'Usuario no disponible.<br>'        
    }else {
        campos.user = true
        document.getElementById('user').classList.remove('campoInvalido')
        document.getElementById('mensajeError-user').classList.remove('mostrar')
    }
}

// Validación para cada input de acuerdo al tipo de datos que permiten
function validarInput(i) {
    switch(i.target.id) {
        case 'user':            
            document.getElementById('mensajeError-user').innerHTML = ''
            document.getElementById('mensajeError-user').classList.remove('mostrar')             
            if (i.target.value.length < 4 || i.target.value.length > 20) {
                document.getElementById('user').classList.add('campoInvalido')
                document.getElementById('mensajeError-user').classList.add('mostrar')
                document.getElementById('mensajeError-user').innerHTML += 'Nombre de usuario debe estar entre 4 y 20 caracteres.<br>'                
            }
            if (!expresiones.usuario.test(i.target.value)) {
                document.getElementById('user').classList.add('campoInvalido')
                document.getElementById('mensajeError-user').classList.add('mostrar')
                document.getElementById('mensajeError-user').innerHTML += 'Solo se permiten caracteres alfanuméricos.<br>'
            } else {
                document.getElementById('user').classList.remove('campoInvalido')
                campos['user'] = true
            }
            break
        case 'name':
            document.getElementById('mensajeError-name').innerHTML = '' 
            document.getElementById('mensajeError-name').classList.remove('mostrar')
            campos['name'] = false               
            if (i.target.value == '' || i.target.value == null) {
                document.getElementById('name').classList.add('campoInvalido')
                document.getElementById('mensajeError-name').classList.add('mostrar')
                document.getElementById('mensajeError-name').innerHTML += 'Nombre requerido.<br>'                
            }else if (i.target.value.length > 40) {
                document.getElementById('name').classList.add('campoInvalido')
                document.getElementById('mensajeError-name').classList.add('mostrar')
                document.getElementById('mensajeError-name').innerHTML += 'Longitud máxima 40 caracteres.<br>'                
            }else if (!expresiones.nombres.test(i.target.value)) {
                document.getElementById('name').classList.add('campoInvalido')
                document.getElementById('mensajeError-name').classList.add('mostrar')
                document.getElementById('mensajeError-name').innerHTML += 'Caracteres inválidos.<br>'
            } else {
                document.getElementById('name').classList.remove('campoInvalido')
                campos['name'] = true
            }
            break
        case 'lastName':
            document.getElementById('mensajeError-lastName').innerHTML = '' 
            document.getElementById('mensajeError-lastName').classList.remove('mostrar')
            campos['lastName'] = false               
            if (i.target.value == '' || i.target.value == null) {
                document.getElementById('lastName').classList.add('campoInvalido')
                document.getElementById('mensajeError-lastName').classList.add('mostrar')
                document.getElementById('mensajeError-lastName').innerHTML += 'Apellido requerido.<br>'                
            }else if (i.target.value.length > 40) {
                document.getElementById('lastName').classList.add('campoInvalido')
                document.getElementById('mensajeError-lastName').classList.add('mostrar')
                document.getElementById('mensajeError-lastName').innerHTML += 'Longitud máxima 40 caracteres.<br>'                
            }else if (!expresiones.nombres.test(i.target.value)) {
                document.getElementById('lastName').classList.add('campoInvalido')
                document.getElementById('mensajeError-lastName').classList.add('mostrar')
                document.getElementById('mensajeError-lastName').innerHTML += 'Caracteres inválidos.<br>'
            } else {
                document.getElementById('lastName').classList.remove('campoInvalido')
                campos['lastName'] = true
            }
            break
        case 'email':
            document.getElementById('mensajeError-email').innerHTML = ''
            document.getElementById('mensajeError-email').classList.remove('mostrar')
            campos['email'] = false                
            if (i.target.value == '' || i.target.value == null) {
                document.getElementById('email').classList.add('campoInvalido')
                document.getElementById('mensajeError-email').classList.add('mostrar')
                document.getElementById('mensajeError-email').innerHTML += 'Correo requerido.<br>'                
            }else if (!expresiones.correo.test(i.target.value)) {
                document.getElementById('email').classList.add('campoInvalido')
                document.getElementById('mensajeError-email').classList.add('mostrar')
                document.getElementById('mensajeError-email').innerHTML += 'Correo inválido.<br>'
            } else {
                document.getElementById('email').classList.remove('campoInvalido')
                campos['email'] = true
            }
            break
        case 'date':
            document.getElementById('mensajeError-date').innerHTML = ''
            document.getElementById('mensajeError-date').classList.remove('mostrar')
            campos['date'] = false            
            if (i.target.value == '' || i.target.value == null) {
                document.getElementById('date').classList.add('campoInvalido')
                document.getElementById('mensajeError-date').classList.add('mostrar')
                document.getElementById('mensajeError-date').innerHTML += 'Fecha requerida.<br>'                
            }else if(!expresiones.fecha.test(i.target.value)) {
                document.getElementById('date').classList.add('campoInvalido')
                document.getElementById('mensajeError-date').classList.add('mostrar')
                document.getElementById('mensajeError-date').innerHTML += 'Fecha inválida.<br>'
            }else if (fechaInput.value > valorFechaHoy){
                document.getElementById('date').classList.add('campoInvalido')
                document.getElementById('mensajeError-date').classList.add('mostrar')
                document.getElementById('mensajeError-date').innerHTML += 'Fecha no puede ser posterior.<br>'
            } else {
                document.getElementById('date').classList.remove('campoInvalido')
                campos['date'] = true
            }
            break
        case 'password':
            document.getElementById('mensajeError-password').innerHTML = ''
            document.getElementById('mensajeError-password').classList.remove('mostrar')
            if (i.target.value == '' || i.target.value == null) {
                document.getElementById('password').classList.add('campoInvalido')
                document.getElementById('mensajeError-password').innerHTML += 'Contraseña requerida.<br>'                
            }else if (i.target.value.length < 8 || i.target.value.length > 20) {
                document.getElementById('password').classList.add('campoInvalido')
                document.getElementById('mensajeError-password').classList.add('mostrar')
                document.getElementById('mensajeError-password').innerHTML += 'Mínimo 8 y máximo 20 caracteres.<br>'                
            }else if (!expresiones.minusculas.test(i.target.value)) {
                document.getElementById('password').classList.add('campoInvalido')
                document.getElementById('mensajeError-password').classList.add('mostrar')
                document.getElementById('mensajeError-password').innerHTML += 'Debe contener al menos una minuscula.<br>'
            } else if(!expresiones.mayusculas.test(i.target.value)) {
                document.getElementById('password').classList.add('campoInvalido')
                document.getElementById('mensajeError-password').classList.add('mostrar')
                document.getElementById('mensajeError-password').innerHTML += 'Debe contener al menos una mayúscula.<br>'
            }else if(!expresiones.numeros.test(i.target.value)) {
                document.getElementById('password').classList.add('campoInvalido')
                document.getElementById('mensajeError-password').classList.add('mostrar')
                document.getElementById('mensajeError-password').innerHTML += 'Debe contener al menos un número.<br>'
            }else if(!expresiones.simbolo.test(i.target.value)) {
                document.getElementById('password').classList.add('campoInvalido')
                document.getElementById('mensajeError-password').classList.add('mostrar')
                document.getElementById('mensajeError-password').innerHTML += 'Debe contener al menos un simbolo ( -, _, /, ?, .).<br>'
            } else {
                document.getElementById('password').classList.remove('campoInvalido')
            }
            validarContraseñas()
            break
        case 'confPass':
            validarContraseñas()
            break  
    }
}

// Esta función valida que ambas contraseñas coincidan
function validarContraseñas() {
    let pass1 = document.getElementById('password').value                
    let pass2 = document.getElementById('confPass').value                
    document.getElementById('mensajeError-confPass').innerHTML = ''
    document.getElementById('mensajeError-confPass').classList.remove('mostrar') 
    campos['password'] = false               
    if (pass2 == '' || pass2 == null) {
        document.getElementById('confPass').classList.add('campoInvalido')
        document.getElementById('mensajeError-confPass').classList.add('mostrar')
        document.getElementById('mensajeError-confPass').innerHTML += 'Repetir contraseña.<br>'                
    }else if (pass1 !== pass2) {
        document.getElementById('confPass').classList.add('campoInvalido')
        document.getElementById('mensajeError-confPass').classList.add('mostrar')
        document.getElementById('mensajeError-confPass').innerHTML += 'Contraseñas no coinciden.<br>'                
    }else {
        document.getElementById('confPass').classList.remove('campoInvalido')
        document.getElementById('mensajeError-user').classList.remove('mostrar')
        document.getElementById('mensajeError-confPass').innerHTML = ''
        campos['password'] = true
    }
}

// Se agrega un event listener por cada campo cada vez que se pulsa una tecla dentro de él o
// al salir del input
inputs.forEach((input) => {
    input.addEventListener('keyup', validarInput)
    input.addEventListener('blur', validarInput)
})

// Funcion para mostrar un mensaje de error si no se ha seleccionado el checkbox de términos y condiciones
function aceptarTérminos() {
    document.getElementById('mensajeError-terminos').innerHTML = '' 
    document.getElementById('mensajeError-terminos').classList.remove('mostrar') 
    if (!check.checked) {
        document.getElementById('mensajeError-terminos').classList.add('mostrar')
        document.getElementById('mensajeError-terminos').innerHTML += 'Debe aceptar los términos.<br>'  
    }
}

const check = document.getElementById('terminos')
check.addEventListener('click',aceptarTérminos)

//Validar que todos los campos estén llenos antes de enviar formulario
formulario.addEventListener('submit', (e) => {
    e.preventDefault()
    document.getElementById('mensajeError-camposVacios').classList.remove('mostrar')
    document.getElementById('mensajeError-camposVacios').innerHTML = ''
    // Se envía el valor del nombre de usauario a la aplicación main.js para verificar si está disponible.
    ipcRenderer.send('validar-usuario', [document.getElementById('user').value, usuarioUsado])
    // Main.js devuelve false si el usuario está disponible y true si está ocupado
    ipcRenderer.on('usuario-no-disponible',(evt, args) => {
        usuarioUsado = args
        usuarioDisponible(usuarioUsado)
    })

    // Si todos los campos están correctos se envía el nombre de usuario y se muestra un mensaje de bienvenida en una nueva ventana.
    setTimeout(()=>{
        if (campos.user && campos.name && campos.lastName && campos.email && campos.date && campos.password && check.checked){
            ipcRenderer.send('formulario-valido', document.getElementById('user').value)
            formulario.reset()            
        } else {
            document.getElementById('mensajeError-camposVacios').classList.add('mostrar')
            document.getElementById('mensajeError-camposVacios').innerHTML += 'Debe llenar todos los campos'
            aceptarTérminos()        
        }
    },0)
})