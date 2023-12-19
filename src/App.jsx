import React, { useEffect, useState } from 'react';
import Results from './components/results/Results.jsx';
import Favorites from './components/favorites/Favorites.jsx';
import Settings from './components/settings/Settings.jsx';

import notificationOptions from './components/settings/notificationOptions';

const { ipcRenderer } = window.require('electron');

const App = () => {
  const [fact, setFact] = useState('');
  const [storedFacts, setStoredFacts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingError, setIsFetchingError] = useState(false);
  const [settingOpen, setSettingsOpen] = useState(false);
  const [storedSettings, setStoredSettings] = useState(0);
  const [notificationInterval, setNotificationInterval] = useState(0);

  const getFact = () => {
    if (!isFetching) {
      setIsFetching(true);
      setIsFetchingError(false);
      ipcRenderer.send('getFact');
    }
  };

  const handleInterval = (id) => {
    window.clearInterval(notificationInterval);
    if (id !== 0) {
      const newIntervalObject = notificationOptions.find((item) => item.id === id);
      const newIntervalTime = newIntervalObject.time;
      const newInterval = setInterval(() => {
        ipcRenderer.send('runNotifier');
      }, newIntervalTime);
      setNotificationInterval(newInterval);
    }
  };

  const getStoredFacts = () => {
    ipcRenderer.send('getStoredFacts');
  };

  const addStoredFact = (e) => {
    const text = e.target.innerHTML;
    ipcRenderer.send('addToStoredFacts', text);
    getFact();
  };

  const removeStoredFact = (factIndex) => {
    ipcRenderer.send('removeFromStoredFacts', factIndex);
  };

  const getStoredSettings = () => {
    ipcRenderer.send('getStoredSettings');
  };

  const populateStoredSettings = (newSettingsId) => {
    ipcRenderer.send('setStoredSettings', newSettingsId);
  };

  useEffect(() => {
    ipcRenderer.on('gotFact', (event, data) => {
      const { error, response } = data;
      setFact(response);
      setIsFetchingError(error);
      setIsFetching(false);
    });

    ipcRenderer.on('populateFacts', (event, data) => {
      setStoredFacts(data);
    });

    ipcRenderer.on('populateSettings', (event, index) => {
      setStoredSettings(index);
    });
  }, []);

  useEffect(() => {
    getFact();
    getStoredFacts();
    getStoredSettings();
  }, []);

  useEffect(() => {
    handleInterval(storedSettings);
  }, [storedSettings]);

  return (
    <div className="mainContainer">
      <div className="mainBanner">
        <h1 className="mainBanner-header">Get you random daily cat fact</h1>
        <button className='mainBanner-settings' onClick={() => setSettingsOpen(true)}>
          Settings
        </button>
        {settingOpen && (
          <Settings
            closeSettings={() => setSettingsOpen(false)}
            storedSettings={storedSettings}
            populateStoredSettings={populateStoredSettings}
          />
        )}
      </div>
      <div className="dashboard">
        <Results
          fact={fact}
          isFetching={isFetching}
          isFetchingError={isFetchingError}
          getFact={getFact}
          addStoredFact={addStoredFact}
        />
        <Favorites
          storedFacts={storedFacts}
          removeStoredFact={removeStoredFact}
        />
      </div>
    </div>
  );
};

export default App;
