import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Screens/Login/Login'
import Home from './Screens/Home/Home'
import Register from './Screens/Register/Register'
import CommonPage from './Screens/CommonPage/CommonPage'

function App() {
  const [editPro, setEditPro] = useState("");

  return (
    <>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={2000} />
        <Routes>
          <Route path='/login' element={< Login />}></Route>
          <Route path='/register' element={< Register />}></Route>
          <Route path='/' element={< CommonPage />}>
            <Route path='/home' element={< Home />}></Route>

          </Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
