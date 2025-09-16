import { Router } from 'express';
import { CashEntry } from '../models/CashEntry';
const router = Router();

let cashEntries: CashEntry[] = [];

router.get('/', (req, res) => {
  res.json({ success: true, data: cashEntries });
});

router.post('/', (req, res) => {
  const entry: CashEntry = req.body;
  entry.id = Date.now().toString();
  cashEntries.push(entry);
  res.json({ success: true, data: entry });
});

export default router;
