import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const configcors = (app) => {
    const whitelist = [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://back-market-fe-a88q.vercel.app',
        'https://back-market-fe-a88q-lzsd3e2xi-hoang-sns-projects.vercel.app',
        process.env.REACT_URL,
    ].filter(Boolean);

    const corsOptions = {
        origin: function (origin, callback) {
            if (whitelist.indexOf(origin) !== -1 || !origin) {
                callback(null, true);
            } else {
                callback(new Error(`Origin '${origin}' not allowed by CORS`));
            }
        },
        credentials: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    };

    app.use(cors(corsOptions));
};

export default configcors;