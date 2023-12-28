import express from 'express';
import mongoose from 'mongoose';
import { companySchema } from './company.schema.js';
import CompanyController from './company.controllers.js'
import jwtAuthorizer from '../middlewares/jwt.js';
import path from 'path';
const Company = mongoose.model('Company', companySchema);
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const viewsPath = path.join(__dirname, 'views');
const router = express.Router();
const companyControl = new CompanyController();


router.get('/home', async (req, res) => {
    try {
      const companyData = await Company.find();
      const viewsPath = path.join(__dirname, 'views');
      res.render(path.join(viewsPath, 'Interviews'), { companyData });
    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).send('Internal Server Error');
    }
  });
// -------- Get requests ----------
router.get('/allocate', jwtAuthorizer, companyControl.allocateInterview);

// -------- Post Requests ---------
router.post('/schedule-interview', jwtAuthorizer, companyControl.scheduleInterview);
router.get('/schedule-interview', (req, res) => {
    res.sendFile(path.join(viewsPath, 'addinterview.html'));
});
router.put('/update-status/:id', jwtAuthorizer, companyControl.updateStatus);

export default router;
