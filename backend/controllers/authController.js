import jwt from 'jsonwebtoken';
import Joi from 'joi';
// import User from '@models/User.js';
import bcrypt from 'bcrypt';


const signupSchema = Joi.object({
    name: Joi.string().lowercase().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).required(),
});


const loginSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(4).required(),
})


// const signup = async (req, res) => {
//     try {
//         const { name, email, password } = await signupSchema.validateAsync(req.body);

//         const user = await User.findOne({ email });

//         if (user) {
//             if (user.email === email) {
//                 return res.status(400).json({
//                     error: 'Bad Request',
//                     messageCode: 'email_already_exists',
//                     message: 'Email already exists',
//                 });
//             } else {
//                 return res.status(400).json({
//                     error: 'Bad Request',
//                     messageCode: 'username_already_exists',
//                     message: 'Username already exists',
//                 });
//             }
//         }

//         // Hash the password
//         const salt = bcrypt.genSaltSync(10);
//         const hashedPassword = bcrypt.hashSync(password, salt);

//         // Create a new user
//         const newUser = new User({
//             name: name.toLowerCase(),
//             email,
//             password: hashedPassword,
//         });

//         await newUser.save();

//         res.status(201).json({
//             message: 'User created successfully',
//         });

//     } catch (error) {
//         if (error.isJoi) {
//             return res.status(400).json({
//                 status: 400,
//                 error: 'Bad Request',
//                 message: error.message.replaceAll('\"', ''),
//             });
//         }
//         return res.status(400).json({
//             status: 400,
//             error: 'Bad Request',
//             message: error.message,
//         });
//     }
// };

// const login = async (req, res, next) => {
//     try {
//         const { email, password } = await loginSchema.validateAsync(req.body);

//         const user = await User.findOne({ email: email });

//         if (!user) {
//             return res.status(404).json({
//                 status: 404,
//                 error: 'Not Found',
//                 messageCode: 'account_not_found',
//                 message: 'Account not found',
//             });
//         }

//         const isValidPassword = bcrypt.compareSync(password, user.password);

//         if (!isValidPassword) {
//             return res.status(401).json({
//                 status: 401,
//                 error: 'Unauthorized',
//                 messageCode: 'invalid_credentials',
//                 message: 'Invalid credentials',
//             });
//         }

//         const token = jwt.sign({
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//         }, process.env.JWT_SECRET, { expiresIn: '1h' });

//         res.status(200).json({
//             token,
//             user: {
//                 _id: user._id,
//                 name: user.name,
//                 email: user.email,
//             }
//         });

//     } catch (error) {
//         if (error.isJoi) {
//             if (error.details.find((detail) => detail.type == "object.xor")) {
//                 return res.status(400).json({
//                     status: 400,
//                     error: 'Bad Request',
//                     message: "Either username or email is required"
//                 });
//             }
//             return res.status(400).json({
//                 status: 400,
//                 error: 'Bad Request',
//                 message: error.message.replaceAll('\"', ''),
//             });
//         }
//         return res.status(400).json({
//             status: 400,
//             error: 'Bad Request',
//             message: error.message,
//         });
//     }
// }



export default {
    signup:() => {},
    login:() => {},
};