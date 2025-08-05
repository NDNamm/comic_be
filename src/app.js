import dotenv from 'dotenv';
import express from 'express';
import Comics from './routers/Comics.router.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use('/api/comics', Comics);
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});