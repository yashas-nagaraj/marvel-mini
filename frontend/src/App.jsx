import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MalePage from './pages/MalePage'
import FemalePage from './pages/FemalePage'
import CharacterPage from './pages/CharacterPage'

export default function App(){
  return (
    <div style={{fontFamily:'sans-serif'}}>
      <nav style={{padding:12,background:'#111',color:'#fff'}}>
        <Link to="/" style={{color:'#fff',textDecoration:'none'}}>Marvel Mini</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/male" element={<MalePage/>} />
        <Route path="/female" element={<FemalePage/>} />
        <Route path="/character/:id" element={<CharacterPage/>} />
      </Routes>
    </div>
  )
}
