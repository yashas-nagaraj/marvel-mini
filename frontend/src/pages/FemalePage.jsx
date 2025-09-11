import React from 'react'
import { FEMALE_CHARACTERS } from '../data/characters'
import { Link } from 'react-router-dom'

export default function FemalePage(){
  return (
    <div style={{padding:20}}>
      <h2>Female Characters</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
        {FEMALE_CHARACTERS.map(c=>(
          <Link key={c.id} to={'/character/'+c.id} style={{textDecoration:'none',color:'#000',background:'#fff',padding:8,borderRadius:8,textAlign:'center'}}>
            <img src={'/images/'+c.img} alt={c.name} style={{width:'100%',height:160,objectFit:'cover',borderRadius:6}} />
            <div style={{marginTop:8,fontWeight:600}}>{c.name}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
