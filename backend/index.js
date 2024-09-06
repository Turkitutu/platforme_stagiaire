import express from 'express';
import mongoose from 'mongoose';
import routers from '@routers/index.js';
import cors from "cors"
import dotenv from 'dotenv';


dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }
));

app.use('/', routers);


app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`${req.method} ${req.url} - ${res.statusCode}`);
    });
    next();
});

app.get('*', (req, res) => {
    res.status(404).json({
        status: 404,
        error: 'Not Found',
        message: 'The requested resource was not found',
    });
});


app.use((err, req, res, next) => {
    // Set the status code (default to 500 if not set)
    res.status(err.status || 500);

    console.log(err);

    // Send error response
    res.json({
        message: err.message,
        // Only include stack trace in development
        ...(process.env.BUN_ENV === 'development' && { stack: err.stack })
    });

});

const main = async () => {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });
}

main().catch(console.log);