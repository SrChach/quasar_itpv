import { app, BrowserWindow, nativeTheme, ipcMain } from 'electron'
import { getProducts, insertProduct, checkAdminUser, insertTicket, updateProduct, updateStockCurrent, updateStockLevel } from '../queries.js'

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname
}

let mainWindow

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  })

  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/** Code for managing SQL requests and responses */
ipcMain.on('call-get-products', async (event, arg) => {
  const result = await getProducts()
  event.reply('response-get-products', result)
})

ipcMain.on('call-insert-products', async (event, product) => {
  const result = await insertProduct(product)
  event.reply('response-insert-products', result)
})

ipcMain.on('call-update-product', async (event, product, idObject) => {
  const queryResult = await updateProduct(product, { [idObject.name]: idObject.value })
  const result = {
    affected: queryResult.affectedRows,
    error: queryResult.error,
    idObject: idObject
  }
  event.reply('response-update-product', result)
})

ipcMain.on('call-update-stock', async (event, idObject, units) => {
  const stock = await updateStockCurrent(idObject.value, units)
  const result = {
    affected: stock.affectedRows,
    tableId: idObject.tableId,
    error: stock.error
  }
  event.reply('response-update-stock', result)
})

ipcMain.on('call-update-stocklevel', async (event, idObject, min, max) => {
  const stock = await updateStockLevel(idObject.value, min, max)
  const result = {
    affected: stock.affectedRows,
    tableId: idObject.tableId,
    error: stock.error
  }
  event.reply('response-update-stocklevel', result)
})

ipcMain.on('call-check-admin', async (event, password) => {
  const result = await checkAdminUser(password)
  event.reply('response-check-admin', result)
})

// Escucha un evento de la vista, recibe datos
ipcMain.on('llamar-insertar-ticket', async (event, datos, resourceId) => {
  const result = await insertTicket(datos, resourceId)
  event.reply('responder-insertar-ticket', result, resourceId)
})
