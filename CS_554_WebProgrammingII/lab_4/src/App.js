import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./component/Home"
import List from "./component/List"
import Details from "./component/Details"

import Error from "./component/Error"

function App() {
  return (
    <div className="App" >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:category/page/:page" element={<List />} />
          <Route path="/:category/:id" element={<Details />} />
          <Route path="/error" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
