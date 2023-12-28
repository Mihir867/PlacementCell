import express from 'express';
import { connectMongoose } from './middlewares/mongoose.js';
import userRouter from './users/users.routes.js';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Studentrouter from './students/students.routes.js';
import router from './interviews/company.routes.js'

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.set('view engine', 'ejs');
const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFilePath);

app.use('/api/user/', userRouter);
app.use('/api/students/', Studentrouter);
app.use('/api/company', router);

 

app.listen(3200, ()=>{
    console.log("Server is listening on port 3200");
    connectMongoose();
})