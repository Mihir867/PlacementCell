import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserRepository from './users.repository.js';
import ejs from 'ejs';
import fs from 'fs';
export default class UserController{
    constructor(){
        this.userRepository = new UserRepository();
      }

    async resetPass(req, res, next){
        const {newPass} = req.body;
        const hashedpass = await bcrypt.hash(newPass, 4);
        const userID = req.userID;
        try {
            await this.userRepository.resetPassword(userID, hashedpass);

        } catch (error) {
            console.log(error);        }
    }
    async signUp(req, res) {
        try {
            console.log(req.body);
            const { name, email, password } = req.body;
            console.log(password);
            const salt =  await bcrypt.genSalt(10);
            const hashedpass =  await bcrypt.hash(password, salt);

            const user = await this.userRepository.signup({ name, email, password: hashedpass });
            res.status(201).json(user);
        } catch (error) {
            if (error.message === 'User with this email already exists') {
                res.status(400).json({ error: 'Email is already registered' });
            } else {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    }

    async Login(req, res) {
        try {
            const user = await this.userRepository.findbyEmail(req.body.email);
            console.log('Request password:', req.body.password);
            console.log('Database hashed password:', user.password);

            if (!user) {
                return res.send("Invalid credentials");
            }
            if (!user.password) {
                return res.send("Invalid password");
            }
    
            const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
            console.log('Password comparison result:', isPasswordValid);

            if (isPasswordValid) {
                const secretKey = process.env.JWT_SECRET || 'defaultSecretKey';
                const token = jwt.sign({ userID: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
                res.cookie('authToken', token, { maxAge: 3600000, httpOnly: true });
                res.redirect('/api/students/');

            } else {
                return res.send("Invalid credentials");
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }



    async logout(req, res) {
        try {
          const userId = req.user._id; // Assuming userId is available in the request
          const result = await this.userRepository.deleteToken(userId, tokenToDelete);
    
          if (result.success) {
            return res.status(200).json({ success: true, message: 'Logout successful' });
          } else {
            return res.status(400).json({ success: false, error: 'Logout failed: ' + result.message });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
      }
      
      
}