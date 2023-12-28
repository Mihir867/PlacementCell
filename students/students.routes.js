// Import necessary modules and schemas
import express from 'express';
import jwtAuthorizer from '../middlewares/jwt.js';
import path from 'path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { StudentSchema } from './students.schema.js';
import StudentsControllers from './students.controller.js'
const Student = mongoose.model('Student', StudentSchema);
const Studentrouter = express.Router();
const studentcontrol = new StudentsControllers();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const viewsPath = path.join(__dirname, 'views');


Studentrouter.get('/', async (req, res) => {
    try {
      const studentsData = await Student.find();
      const viewsPath = path.join(__dirname, 'views');
      res.render(path.join(viewsPath, 'home'), { studentsData });
    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
Studentrouter.delete('/delete/:id', jwtAuthorizer, studentcontrol.deleteStudent);
Studentrouter.post('/create-student', studentcontrol.createStudent);
Studentrouter.get('/download-csv', studentcontrol.download);
Studentrouter.get('/create-student', (req, res) => {
    res.sendFile(path.join(viewsPath, 'add_student.html'));
});

export default Studentrouter;

