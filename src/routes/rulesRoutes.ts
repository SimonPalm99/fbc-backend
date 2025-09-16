import { Router } from 'express';
import { FineRule } from '../models/FineRule';
const router = Router();

let fineRules: FineRule[] = [];

router.get('/', (req, res) => {
  res.json({ success: true, data: fineRules });
});

router.post('/', (req, res) => {
  const rule: FineRule = req.body;
  rule.id = Date.now().toString();
  rule.createdAt = new Date().toISOString();
  fineRules.push(rule);
  res.json({ success: true, data: rule });
});

export default router;
