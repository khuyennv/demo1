import './App.css';

import React from 'react';

import DemoComponent from './components/DemoComponent';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <>
        <Header title="React App" />
      </>

      <DemoComponent />
    </div>
  );
}

export default App;
