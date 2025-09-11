import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MALE_CHARACTERS, FEMALE_CHARACTERS } from '../data/characters'

const findMeta = (id) => {
  const all = [...MALE_CHARACTERS, ...FEMALE_CHARACTERS]
  return all.find(x=>x.id===id) || { id, name:id, img:'characters/'+id+'/banner.jpg' }
}

export default function CharacterPage(){
  const { id } = useParams()
  const meta = findMeta(id)
  const [questions, setQuestions] = useState([])
  const [answersMap, setAnswersMap] = useState({})
  const [answerText, setAnswerText] = useState('')

  useEffect(()=>{
    fetch('/api/questions').then(r=>r.ok? r.json():[]).then(setQuestions).catch(()=>{})
  },[])

  const submitAnswer = async (questionId) => {
    if(!answerText.trim()) return
    await fetch('/api/answers/'+questionId, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({answer:answerText})}).catch(()=>{})
    setAnswerText('')
    const res = await fetch('/api/answers/'+questionId).then(r=>r.ok? r.json():[]).catch(()=>[])
    setAnswersMap(prev=>({...prev,[questionId]:res}))
  }

  return (
    <div style={{padding:20}}>
      <div style={{display:'flex',gap:20,alignItems:'center'}}>
        <img src={'/images/'+meta.img} alt={meta.name} style={{width:220,height:220,objectFit:'cover',borderRadius:8}} />
        <div>
          <h1>{meta.name}</h1>
          <p>Placeholder bio for {meta.name}. Edit frontend/src/data/characters.js to add details.</p>
        </div>
      </div>

      <section style={{marginTop:24}}>
        <h3>Media</h3>
        <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
          <img src={'/images/characters/'+id+'/img1.jpg'} alt='' style={{width:320,height:180,objectFit:'cover',borderRadius:6}} onError={e=>e.target.style.display='none'} />
          <img src={'/images/characters/'+id+'/img2.jpg'} alt='' style={{width:320,height:180,objectFit:'cover',borderRadius:6}} onError={e=>e.target.style.display='none'} />
          <video controls style={{width:420,height:240}} onError={e=>e.style.display='none'}>
            <source src={'/images/characters/'+id+'/video.mp4'} type="video/mp4" />
          </video>
        </div>
      </section>

      <section style={{marginTop:24}}>
        <h3>Community Q&A</h3>
        {questions.map(q=>(
          <div key={q.id} style={{padding:12,border:'1px solid #eee',borderRadius:8,marginBottom:8}}>
            <div style={{fontWeight:700}}>{q.question_text}</div>
            <div style={{fontSize:12,color:'#666'}}>{new Date(q.created_at).toLocaleString()}</div>

            <div style={{marginTop:8}}>
              <input placeholder="Your answer" value={answerText} onChange={e=>setAnswerText(e.target.value)} style={{width:'70%'}} />
              <button onClick={()=>submitAnswer(q.id)} style={{marginLeft:8}}>Answer</button>
            </div>

            <div style={{marginTop:8}}>
              {(answersMap[q.id]||[]).map(a=>(
                <div key={a.id} style={{padding:6,background:'#fafafa',borderRadius:6,marginTop:6}}>
                  {a.answer_text} <div style={{fontSize:11,color:'#666'}}>{new Date(a.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
