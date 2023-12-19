const {
  app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, Notification,
} = require('electron');
const Store = require('electron-store');

if (require('electron-squirrel-startup')) {
  app.quit();
}

let tray;
let mainWindow;
const store = new Store();

const createWindow = () => {
  /* eslint-disable no-undef */
  mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: MAIN_WINDOW_WEBPACK_ENTRY,
    },
    icon: nativeImage.createFromPath('src/assets/cat.png'),
  });
  mainWindow.setMenu(null);
  mainWindow.maximize();
  mainWindow.show();
  // mainWindow.webContents.openDevTools();
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }

    return false;
  });
  /* eslint-enable no-undef */
};

app.whenReady().then(() => {
  const icon = nativeImage.createFromPath('src/assets/cat.png');
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open',
      click() {
        mainWindow.show();
      },
    },
    {
      label: 'Quit',
      click() {
        mainWindow.destroy();
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('Cat app');
  tray.setTitle('Cat app');
  tray.on('click', () => {
    mainWindow.show();
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('getFact', async () => {
  try {
    const response = await fetch('https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=1');
    const body = await response.text();
    const factText = JSON.parse(body).text;
    mainWindow.webContents.send('gotFact', { error: false, response: factText });
  } catch {
    mainWindow.webContents.send('gotFact', { error: true, response: '' });
  }
});

ipcMain.on('getStoredFacts', () => {
  const storedFacts = store.get('StoredFacts') || [];
  mainWindow.webContents.send('populateFacts', storedFacts);
});

ipcMain.on('addToStoredFacts', (e, newFact) => {
  const storedFacts = store.get('StoredFacts') || [];
  const newStoredFacts = [...storedFacts];
  newStoredFacts.unshift(newFact);
  store.set('StoredFacts', newStoredFacts);
  mainWindow.webContents.send('populateFacts', newStoredFacts);
});

ipcMain.on('removeFromStoredFacts', (e, indexToRemove) => {
  const storedFacts = store.get('StoredFacts');
  const newStoredFacts = [...storedFacts];
  newStoredFacts.splice(indexToRemove, 1);
  store.set('StoredFacts', newStoredFacts);
  mainWindow.webContents.send('populateFacts', newStoredFacts);
});

ipcMain.on('getStoredSettings', () => {
  const storedSettings = store.get('StoredSettings') || 0;
  mainWindow.webContents.send('populateSettings', storedSettings);
});

ipcMain.on('setStoredSettings', (e, newSettingsIndex) => {
  store.set('StoredSettings', newSettingsIndex);
  mainWindow.webContents.send('populateSettings', newSettingsIndex);
});

ipcMain.on('runNotifier', () => {
  const NOTIFICATION_APP_NAME = 'Cat app';
  const NOTIFICATION_TITLE = 'New fact!';
  const NOTIFICATION_BODY = 'New cat fact is waiting for you.';

  const showNotification = () => {
    if (process.platform === 'win32') {
      app.setAppUserModelId(NOTIFICATION_APP_NAME);
    }
    new Notification({
      title: NOTIFICATION_TITLE,
      body: NOTIFICATION_BODY,
      subtitle: NOTIFICATION_APP_NAME,
      icon: 'src/assets/cat.png',
    }).show();
  };

  showNotification();
});
