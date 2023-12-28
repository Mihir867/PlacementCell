import mongoose from 'mongoose';
import { StudentSchema } from '../students/students.schema.js';
import { companySchema } from './company.schema.js';

const Student = mongoose.model('Student', StudentSchema);
const Company = mongoose.model('Company', companySchema);

export default class CompanyController {
  async companyPage(req, res) {
    try {
      const companyData = await Company.find();
      res.json(companyData);
    } catch (error) {
      console.error(`Error in rendering page: ${error}`);
      return res.redirect('back');
    }
  }

  async allocateInterview(req, res) {
    try {
      const studentsData = await Company.find({});
      const array = [...new Set(studentsData.map(student => student.batch))];
      return res.render('allocateInterview', { students: studentsData, array });
    } catch (error) {
      console.error(`Error in allocating interview: ${error}`);
      return res.redirect('back');
    }
  }

  async scheduleInterview(req, res) {
    const { id, company, date } = req.body;
    try {
      const existingCompany = await Company.findOne({ name: company });
      const obj = {
        student: id,
        date,
        result: 'Pending',
      };

      if (!existingCompany) {
        const newCompany = await Company.create({
          name: company,
        });
        newCompany.students.push(obj);
        newCompany.save();
      } else {
        for (let student of existingCompany.students) {
          if (student.student.toString() === id) {
            console.log('Interview with this student already scheduled');
            return res.redirect('back');
          }
        }
        existingCompany.students.push(obj);
        existingCompany.save();
      }

      const student = await Student.findById(id);

      if (student) {
        const interview = {
          company,
          date,
          result: 'Pending',
        };
        student.interviews.push(interview);
        student.save();
      }
      console.log('Interview Scheduled Successfully');
      return res.redirect('/company/home');
    } catch (error) {
      console.error(`Error in scheduling Interview: ${error}`);
      return res.redirect('back');
    }
  }

  async updateStatus(req, res) {
    const { id } = req.params;
    const { companyName, companyResult } = req.body;
    try {
      const student = await Student.findById(id);

      if (student && student.interviews.length > 0) {
        for (let company of student.interviews) {
          if (company.company === companyName) {
            company.result = companyResult;
            student.save();
            break;
          }
        }
      }

      const company = await Company.findOne({ name: companyName });

      if (company) {
        for (let std of company.students) {
          if (std.student.toString() === id) {
            std.result = companyResult;
            company.save();
          }
        }
      }
      console.log('Interview Status Changed Successfully');
      return res.redirect('back');
    } catch (error) {
      console.error(`Error in updating status: ${error}`);
      return res.redirect('back');
    }
  }
}
