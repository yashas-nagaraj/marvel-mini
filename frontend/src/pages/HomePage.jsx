import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { THEME_CHARACTERS } from '../data/characters'

export default function HomePage(){
  const [theme, setTheme] = useState('#b30e0e')
  const [question, setQuestion] = useState('')
  const [questions, setQuestions] = useState([])

  useEffect(()=>{ fetch('/api/questions').then(r=>r.ok? r.json():[]).then(setQuestions).catch(()=>{}) },[])

  const submit = async ()=>{
    if(!question.trim()) return
    await fetch('/api/questions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question})}).catch(()=>{})
    setQuestion('')
    const resp = await fetch('/api/questions').then(r=>r.ok? r.json():[]).catch(()=>[])
    setQuestions(resp)
  }

  return (
    <div style={{padding:20}}>
      <header style={{background:theme,color:'#fff',padding:30,borderRadius:8}}>
        <h1>Marvel Mini</h1>
        <p>Small demo: pick a theme and explore characters.</p>
        <div style={{display:'flex',gap:8}}>
          {THEME_CHARACTERS.map(c=>(
            <button key={c.id} onClick={()=>setTheme(c.theme)} style={{padding:8,background:c.theme,color:'#fff',border:'none',borderRadius:6}}>
              <img src={'/images/'+c.img} alt={c.name} style={{width:48,height:48,objectFit:'cover',borderRadius:6}}/>
            </button>
          ))}
        </div>
      </header>

      <section style={{marginTop:18, display:'flex', gap:12}}>
        <Link to="/male" style={{flex:1, padding:18, background:'#fafafa', textDecoration:'none', color:'#000', borderRadius:8, textAlign:'center'}}>
          <img src="/images/male-tile.jpg" alt="male" style={{width:'100%',height:120,objectFit:'cover',borderRadius:6}}/>
          <h3>Male Characters</h3>
        </Link>
        <Link to="/female" style={{flex:1, padding:18, background:'#fafafa', textDecoration:'none', color:'#000', borderRadius:8, textAlign:'center'}}>
          <img src="/images/female-tile.jpg" alt="female" style={{width:'100%',height:120,objectFit:'cover',borderRadius:6}}/>
          <h3>Female Characters</h3>
        </Link>
      </section>

      <section style={{marginTop:24}}>
        <h3>Ask a question</h3>
        <textarea value={question} onChange={e=>setQuestion(e.target.value)} rows={4} cols={80} placeholder="What do you want to know about Marvel?" />
        <br/>
        <button onClick={submit} style={{marginTop:8}}>Submit question</button>
      </section>

      <section style={{marginTop:24}}>
        <h3>Recent questions</h3>
        <ul>
          {questions.map(q=>(<li key={q.id}>{q.question_text} <small style={{color:'#666'}}>({new Date(q.created_at).toLocaleString()})</small></li>))}
          {questions.length===0 && <li>No questions yet — be the first!</li>}
        </ul>
      </section>
    </div>
  )
}
