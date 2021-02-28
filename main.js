const { app, BrowserWindow, ipcMain } = require('electron')

// Arreglo con los usuarios utilizados.
let usuariosUsados = ['juan', 'diego', 'jose123', 'leo64', 'mario123',
'pain', 'maria98', 'luis456', 'leonardo', 'bruno']

let win
function createWindow() {
    win = new BrowserWindow({
        width: 550,
        height: 660,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.loadFile('./index/index.html')
}
app.whenReady().then(createWindow)

let win2
function createWindowSecondary() {
    win2 = new BrowserWindow({
        width: 550,
        height: 300,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win2.loadFile('./ventana2/ventana2.html')
}

// Validación de nombre de usuario
ipcMain.on('validar-usuario', (evt, args) =>{
    for( let i = 0; i < usuariosUsados.length; i++) {
        if (usuariosUsados[i] == args[0]) {
            args[1] = true
            break;
        } else {
            args[1] = false
        }
    }
    evt.reply('usuario-no-disponible', args[1])
})

//mostrar mensaje en segunda ventana
ipcMain.on('formulario-valido', (evt, args) => {
    createWindowSecondary()
    win2.webContents.on('did-finish-load',() =>{
        win2.webContents.send('mensaje', args)
    })
})