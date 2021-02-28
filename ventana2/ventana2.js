const { ipcRenderer } = require ('electron')

ipcRenderer.on('mensaje',(evt, args) => {
    document.getElementById('bienvenida').innerHTML = 'Bienvenido, <strong>'+ args + '</strong>, cuenta creada con éxito.'
})