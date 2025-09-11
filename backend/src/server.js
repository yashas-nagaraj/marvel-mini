const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
app.use(cors())
app.use(express.json())

const {
  DB_HOST = 'localhost',
  DB_USER = 'postgres',
  DB_PASS = '',
  DB_NAME = 'marvel_db',
  DB_PORT = 5432
} = process.env

const pool = new Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  port: DB_PORT
})

;(async ()=>{
  try {
    const c = await pool.connect()
    await c.query(`CREATE TABLE IF NOT EXISTS questions (
      id SERIAL PRIMARY KEY,
      question_text TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`)
    await c.query(`CREATE TABLE IF NOT EXISTS answers (
      id SERIAL PRIMARY KEY,
      question_id INT REFERENCES questions(id) ON DELETE CASCADE,
      answer_text TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`)
    c.release()
    console.log('DB tables ensured')
  } catch (err) {
    console.error('DB init error', err && err.message ? err.message : err)
  }
})()

app.get('/api/health', (req,res)=>res.json({ok:true}))

app.get('/api/questions', async (req,res)=>{
  try {
    const r = await pool.query('SELECT * FROM questions ORDER BY created_at DESC LIMIT 200')
    res.json(r.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({error:'db error'})
  }
})

app.post('/api/questions', async (req,res)=>{
  const { question } = req.body || {}
  if(!question || !question.toString().trim()) return res.status(400).json({error:'question required'})
  try {
    const r = await pool.query('INSERT INTO questions(question_text) VALUES($1) RETURNING *',[question.toString()])
    res.status(201).json(r.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({error:'db error'})
  }
})

app.post('/api/answers/:questionId', async (req,res)=>{
  const { answer } = req.body || {}
  const qId = req.params.questionId
  if(!answer) return res.status(400).json({error:'answer required'})
  try {
    const r = await pool.query('INSERT INTO answers(question_id,answer_text) VALUES($1,$2) RETURNING *',[qId,answer])
    res.status(201).json(r.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({error:'db error'})
  }
})

app.get('/api/answers/:questionId', async (req,res)=>{
  const qId = req.params.questionId
  try {
    const r = await pool.query('SELECT * FROM answers WHERE question_id=$1 ORDER BY created_at DESC',[qId])
    res.json(r.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({error:'db error'})
  }
})

const PORT = process.env.PORT || 4000
app.listen(PORT, ()=>console.log('marvel-backend running on',PORT))
