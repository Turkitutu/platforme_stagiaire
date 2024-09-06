import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            status: 401,
            error: 'Unauthorized',
            message: 'Unauthorized',
        });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                status: 403,
                error: 'Forbidden',
                message: 'Forbidden',
            });
        }

        req.user = user;
        next();
    });



}