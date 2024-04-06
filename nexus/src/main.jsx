import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {AuthProvider} from './context/AuthProvider.jsx'
import {BrowserRouter, Routes, Route} from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <BrowserRouter>
          <AuthProvider>
              <Routes>
                  <Route path="/*" element={<App/>}/>
              </Routes>
          </AuthProvider>
      </BrowserRouter>
  </React.StrictMode>,
)
