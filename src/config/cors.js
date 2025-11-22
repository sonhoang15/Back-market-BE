import 'dotenv/config';

const configcors = (app) => {
    const allowedOrigins = [
        process.env.REACT_URL || 'http://localhost:3000',
        'https://back-market-be.onrender.com'   // thêm domain FE vào đây
    ];

    app.use((req, res, next) => {
        const origin = req.headers.origin;

        if (allowedOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
            res.setHeader('Access-Control-Allow-Credentials', 'true');
        }

        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);  // đổi từ 204 -> 200 để Render không block
        }

        next();
    });
};

export default configcors;
