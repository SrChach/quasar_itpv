import { app, BrowserWindow, nativeTheme, ipcMain, shell } from 'electron'
import {
  checkDBConnection, getProducts, getTotalPages, checkAdminUser, insertTicket, updateProduct,
  updateStockCurrent, updateStockLevel, insertProducts, insertCustomers, ejecutarScript
} from '../queries.js'

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
  var force_quit = false

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

  mainWindow.removeMenu()

  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('close', function() {
    mainWindow.webContents.send('close-window')
  })

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
ipcMain.on('call-check-db', async (event) => {
  const result = await checkDBConnection()
  event.reply('response-check-db', result)
})

ipcMain.on('call-get-products-paginator', async (event, itemsPerPage = 5, search) => {
  search = (!search) ? undefined : search
  const result = await getTotalPages(itemsPerPage, search)
  event.reply('response-get-products-paginator', result)
})

ipcMain.on('call-get-products', async (event, search, offset = 0, itemsPerPage = 5) => {
  search = (!search) ? undefined : search
  const result = await getProducts(search, offset, itemsPerPage)
  event.reply('response-get-products', result)
})

ipcMain.on('call-insert-products', async (event, products, fromExcel = false) => {
  const result = await insertProducts(products, fromExcel)
  event.reply('response-insert-products', result)
})

ipcMain.on('call-insert-customers', async (event, customers, fromExcel = false) => {
  const result = await insertCustomers(customers, fromExcel)
  event.reply('response-insert-customers', result)
})

ipcMain.on('call-update-product', async (event, product, idObject, hideSuccess = false) => {
  const queryResult = await updateProduct(product, { [idObject.name]: idObject.value })
  const result = {
    affected: queryResult.affectedRows,
    error: queryResult.error,
    idObject: idObject,
    hideSuccess: hideSuccess
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

ipcMain.on('llamar-scripts', async (event, sql) => {
  const result = await ejecutarScript(sql)
  event.reply('responder-scripts', result)
})

ipcMain.on('llamar-scriptsVentas', async (event, sql) => {
  const result = await ejecutarScript(sql)
})

ipcMain.on('force-close-window', async (event) => {
  mainWindow.webContents.send('close-window')
  mainWindow.close()
})

ipcMain.on('open-url', async (event, url) => {
  shell.openExternal(url)
})


