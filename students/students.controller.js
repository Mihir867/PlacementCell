// students.controller.js

import mongoose from 'mongoose';
import { StudentSchema } from './students.schema.js';
import { companySchema } from '../interviews/company.schema.js';
import createCsvWriter from 'csv-writer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const Student = mongoose.model('Student', StudentSchema);
const Company = mongoose.model('Company', companySchema);
const viewsPath = path.join(__dirname, 'views');

export default class StudentsController {
  

  async getStudents(req, res) {
    try {
      const studentsData = await Student.find();
      res.json(studentsData);
      console.log(studentsData);
    } catch (error) {
      console.error('Controller Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async createStudent(req, res) {
    const { name, email, college, placement, contactNumber, Year, dsa, webd, react, company } = req.body;

    try {
      const existingStudent = await Student.findOne({ email });

      if (existingStudent) {
        console.log('Email already exists');
        return res.redirect('back');
      }

      const newStudent = await Student.create({
        name,
        email,
        college,
        Year, // Adjusted from 'batch'
        placement,
        contactNumber,
        dsa,
        webd,
        react,
        company,
      });

      await newStudent.save();
      return res.render('views/home.html');
    } catch (error) {
      console.log(`Error in creating student: ${error}`);
      return res.redirect('back');
    }
  }

  async deleteStudent(req, res) {
    const { id } = req.params;

    try {
      const student = await Student.findById(id);

      if (student && student.interviews.length > 0) {
        for (let item of student.interviews) {
          const company = await Company.findOne({ name: item.company });

          if (company) {
            for (let i = 0; i < company.students.length; i++) {
              if (company.students[i].student.toString() === id) {
                company.students.splice(i, 1);
                company.save();
                break;
              }
            }
          }
        }
      }

      await Student.findByIdAndDelete(id);
      res.redirect('/api/students');
    } catch (error) {
      console.log('Error in deleting student');
      return res.redirect('back');
    }
  }

  async download(req, res) {
    try {
      const csvData = await Student.find();

      const csvPath = 'students_data.csv';
      const csvHeader = [
        { id: '_id', title: 'ID' },
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'college', title: 'College' },
        { id: 'placement', title: 'Placement' },
        { id: 'contactNumber', title: 'Contact Number' },
        { id: 'Year', title: 'Year' },
        { id: 'dsa', title: 'DSA' },
        { id: 'webd', title: 'WebD' },
        { id: 'react', title: 'React' },
      ];

      // Create CSV writer
      const csvWriter = createCsvWriter.createObjectCsvWriter({
        path: csvPath,
        header: csvHeader,
      });

      // Write data to CSV file
      await csvWriter.writeRecords(csvData);

      // Send the CSV file in the response
      res.download(csvPath, (err) => {
        if (err) {
          console.error('Error sending CSV file:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          console.log('CSV file sent successfully');
          // Remove the CSV file after sending
          fs.unlinkSync(csvPath);
        }
      });
    } catch (error) {
      console.error('Error generating CSV data:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
