import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import notificationOptions from './notificationOptions';

const Settings = ({
  closeSettings,
  storedSettings,
  populateStoredSettings,

}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [selected, setSelected] = useState(0);

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    if (selected === 0) setSelected(1);
    if (selected !== 0) setSelected(0);
  };

  const saveSettings = () => {
    populateStoredSettings(selected);
    closeSettings();
  };

  useEffect(() => {
    setSelected(storedSettings);
    if (storedSettings === 0) setNotificationsEnabled(false);
    if (storedSettings !== 0) setNotificationsEnabled(true);
  }, [storedSettings]);

  return (
    <section className='settings'>
      <div className="settings-backdrop" onClick={closeSettings}/>
      <div className='settings-container'>
        <button className="settings-close" onClick={closeSettings}>X</button>
        <p className="settings-header">Set notification time</p>
        <div
          className="settings-enable"
          onClick={() => toggleNotifications()}
        >
          <input
            type="checkbox"
            name="notifications"
            checked={notificationsEnabled}
            readOnly
          />
          <label htmlFor="notifications">Enable notifications</label>
        </div>
        <section>
          {notificationOptions.map((option, optionIndex) => (
          <div
            className={clsx({
              'settings-option': true,
              disabled: !notificationsEnabled,
            })}
            key={optionIndex}
            onClick={() => setSelected(option.id)}
          >
            <input
              disabled={!notificationsEnabled}
              type="radio"
              id={option.id}
              name="notification"
              value={option.time}
              checked={notificationsEnabled && (selected === option.id)}
            />
            <label
              htmlFor={option.label}
            >
              {option.label}
            </label>
          </div>
          ))}
        </section>
        <button onClick={saveSettings} className="settings-button">Save</button>
      </div>
    </section>
  );
};

export default Settings;
