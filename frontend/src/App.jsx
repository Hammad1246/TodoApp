import { useState } from 'react'
import {Outlet} from 'react-router-dom'
import Header from './components/Header.jsx'
import HomePage from './components/Home.jsx'

function App() {

  return (
  <div>
    <Header />
    <Outlet />
  </div>
  )
}

export default App
