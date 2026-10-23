import { Router } from 'express';
import mongoose from 'mongoose';
import Scan from '../models/Scan.js';
import { scanText } from '../services/scanner.js';
const router=Router();

router.post('/', async (req,res,next)=>{
 try {
  const text=req.body?.text;
  if(typeof text!=='string'||!text.trim()) return res.status(400).json({message:'Please enter text to scan.'});
  if(text.length>10000) return res.status(400).json({message:'Text must be 10,000 characters or fewer.'});
  const result=scanText(text);
  // Only summary metadata is saved; never save submitted text or detected values.
  if(mongoose.connection.readyState===1){
   const saved=await Scan.create({riskScore:result.riskScore,riskLevel:result.riskLevel,totalFindings:result.totalFindings,categoryCounts:result.categoryCounts});
   result.scanId=saved._id; result.createdAt=saved.createdAt;
  } else result.historySaved=false;
  res.json(result);
 } catch(e){next(e);}
});
router.get('/',async(_req,res,next)=>{
 try{
  if(mongoose.connection.readyState!==1) return res.json({historyEnabled:false,scans:[]});
  const scans=await Scan.find().sort({createdAt:-1}).limit(50).lean();
  res.json({historyEnabled:true,scans});
 }catch(e){next(e);}
});
router.get('/:id',async(req,res,next)=>{
 try{
  if(mongoose.connection.readyState!==1) return res.status(503).json({message:'Scan history is not configured.'});
  if(!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({message:'Invalid scan ID.'});
  const scan=await Scan.findById(req.params.id).lean();
  if(!scan) return res.status(404).json({message:'Scan record not found.'});
  res.json(scan);
 }catch(e){next(e);}
});
router.delete('/:id',async(req,res,next)=>{
 try{
  if(mongoose.connection.readyState!==1) return res.status(503).json({message:'Scan history is not configured.'});
  if(!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({message:'Invalid scan ID.'});
  const deleted=await Scan.findByIdAndDelete(req.params.id);
  if(!deleted) return res.status(404).json({message:'Scan record not found.'});
  res.status(204).end();
 }catch(e){next(e);}
});
export default router;
