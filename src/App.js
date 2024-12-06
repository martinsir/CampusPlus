import React from 'react';
import './styles/App.css';
import { useTheme } from './context/ThemeContext';

const App = () => {
  const { theme, toggleTheme } = useTheme(); // Access theme and toggle function

  return (
    <div className={`App ${theme}`}>
      <header className="App-header">
        <h1>Campus+ App</h1>
        <p>Current Theme: {theme}</p>
        <button onClick={toggleTheme} className="btn-primary">
          Toggle Theme
        </button>
      </header>
    </div>
  );
};

export default App;
