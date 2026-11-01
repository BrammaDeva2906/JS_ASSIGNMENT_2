require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
app.use(cors()); app.use(express.json());
const PORT = process.env.PORT || 5001;
let memory = [{"_id": "b1", "title": "The Midnight Library", "author": "Matt Haig", "price": 399, "stock": 8, "category": "Fiction", "isbn": "9780525559474"}, {"_id": "b2", "title": "Atomic Habits", "author": "James Clear", "price": 450, "stock": 12, "category": "Self Growth", "isbn": "9780735211292"}, {"_id": "b3", "title": "The Alchemist", "author": "Paulo Coelho", "price": 299, "stock": 0, "category": "Classic", "isbn": "9780061122415"}, {"_id": "b4", "title": "Deep Work", "author": "Cal Newport", "price": 375, "stock": 5, "category": "Productivity", "isbn": "9781455586691"}];
let mongoReady = false;
const schema = new mongoose.Schema({"title": {"type": "String", "required": true}, "author": {"type": "String", "required": true}, "price": {"type": "Number", "min": 0}, "stock": {"type": "Number", "min": 0}, "category": "String", "isbn": "String"}, { timestamps: true });
const Model = mongoose.models.Record || mongoose.model('Record', schema);
async function all(){ return mongoReady ? Model.find().sort({createdAt:-1}) : memory; }
async function create(data){ if(mongoReady) return Model.create(data); const item={_id:Date.now().toString()+Math.random().toString(16).slice(2),...data}; memory.unshift(item); return item; }
async function update(id,data){ if(mongoReady) return Model.findByIdAndUpdate(id,data,{new:true,runValidators:true}); const i=memory.findIndex(x=>x._id===id); if(i<0)return null; memory[i]={...memory[i],...data}; return memory[i]; }
async function remove(id){ if(mongoReady){const r=await Model.findByIdAndDelete(id);return !!r;} const n=memory.length; memory=memory.filter(x=>x._id!==id); return memory.length!==n; }
app.get('/api/health',(req,res)=>res.json({ok:true,database:mongoReady?'mongodb':'memory-fallback'}));
app.get('/api/records',async(req,res)=>{try{let rows=await all(); const q=(req.query.q||'').toLowerCase(); if(q) rows=rows.filter(x=>Object.values(x).some(v=>String(v).toLowerCase().includes(q))); res.json(rows);}catch(e){res.status(500).json({message:e.message});}});
app.post('/api/records',async(req,res)=>{try{const item=await create(req.body);res.status(201).json(item);}catch(e){res.status(400).json({message:e.message});}});
app.put('/api/records/:id',async(req,res)=>{try{const item=await update(req.params.id,req.body); if(!item)return res.status(404).json({message:'Record not found'});res.json(item);}catch(e){res.status(400).json({message:e.message});}});
app.delete('/api/records/:id',async(req,res)=>{try{const ok=await remove(req.params.id); if(!ok)return res.status(404).json({message:'Record not found'});res.json({message:'Deleted'});}catch(e){res.status(500).json({message:e.message});}});
(async()=>{if(process.env.MONGO_URI){try{await mongoose.connect(process.env.MONGO_URI);mongoReady=true;console.log('MongoDB connected');}catch(e){console.warn('MongoDB unavailable; using memory fallback:',e.message);}} app.listen(PORT,()=>console.log(`API running on http://localhost:${PORT}`));})();
