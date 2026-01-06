const express = require('express');
const { auth } = require('../middlewares');
const { authControllers } = require('../controllers');
const { schemaValidate } = require('../middlewares');
const { authValidator } = require('../validationSchemas');

const router = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Register new user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 required:
 *                   - username
 *                   - password
 *                   - email
 *                 properties:
 *                   username:
 *                     type: string
 *                     example: qwx
 *                   password:
 *                     type: string
 *                     example: password
 *                   email:
 *                     type: string
 *                     example: example@gmail.com
 *                   firstName:
 *                     type: string
 *                     example: name
 *                   lastName:
 *                     type: string
 *                     example: surname
 *                   avatarUrl:
 *                     type: string
 *                     example: https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png
 *                   balance: 
 *                     type: number
 *                     example: 0
 *                   totalIncome: 
 *                     type: number
 *                     example: 0
 *                   totalSpend: 
 *                     type: number
 *                     example: 0
 *                   limitForThisMonth: 
 *                     type: number
 *                     example: 0
 *                   spendThisMonth: 
 *                     type: number
 *                     example: 0
 *                   incomeThisMonth: 
 *                     type: number
 *                     example: 0
 *                   expenses: 
 *                     type: array
 *                     items:
 *                       type: object
 *                     example: [{}]
 *                   isVerified: 
 *                     type: boolean
 *                     example: true
 *                   verificationToken: 
 *                     type: string
 *                     example: dsuq38ehquhfdsundqmqj8usdu8aUDWUAudhqudb
 *                   _id: 
 *                     type: string
 *                     example: 68be2e57d3e1e9a8efc7fd6c
 *                   createdAt: 
 *                     type: string
 *                     format: date-time
 *                     example: 2025-09-08T01:16:07.252Z
 *                   updatedAt: 
 *                     type: string
 *                     format: date-time
 *                     example: 2025-09-08T01:16:07.252Z
 *                   fullName: 
 *                     type: string
 *                     example: name surname
 *                   id: 
 *                     type: string
 *                     example: 68be2e57d3e1e9a8efc7fd6c
 *               token:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               message:
 *                 type: string
 *                 example: Registration successful! Check your email to verify your account.
 *     responses:
 *       200:
 *         description: User registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             properties:
 *               user:
 *                 type: object
 *                 required:
 *                   - username
 *                   - password
 *                   - email
 *                 properties:
 *                   username:
 *                     type: string
 *                     example: qwx
 *                   password:
 *                     type: string
 *                     example: password
 *                   email:
 *                     type: string
 *                     example: example@gmail.com
 *                   firstName:
 *                     type: string
 *                     example: name
 *                   lastName:
 *                     type: string
 *                     example: surname
 *                   avatarUrl:
 *                     type: string
 *                     example: https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png
 *                   balance: 
 *                     type: number
 *                     example: 0
 *                   totalIncome: 
 *                     type: number
 *                     example: 0
 *                   totalSpend: 
 *                     type: number
 *                     example: 0
 *                   limitForThisMonth: 
 *                     type: number
 *                     example: 0
 *                   spendThisMonth: 
 *                     type: number
 *                     example: 0
 *                   incomeThisMonth: 
 *                     type: number
 *                     example: 0
 *                   expenses: 
 *                     type: array
 *                     items:
 *                       type: object
 *                     example: [{}]
 *                   isVerified: 
 *                     type: boolean
 *                     example: true
 *                   verificationToken: 
 *                     type: string
 *                     example: dsuq38ehquhfdsundqmqj8usdu8aUDWUAudhqudb
 *                   _id: 
 *                     type: string
 *                     example: 68be2e57d3e1e9a8efc7fd6c
 *                   createdAt: 
 *                     type: string
 *                     format: date-time
 *                     example: 2025-09-08T01:16:07.252Z
 *                   updatedAt: 
 *                     type: string
 *                     format: date-time
 *                     example: 2025-09-08T01:16:07.252Z
 *                   fullName: 
 *                     type: string
 *                     example: name surname
 *                   id: 
 *                     type: string
 *                     example: 68be2e57d3e1e9a8efc7fd6c
 *               token:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               message:
 *                 type: string
 *                 example: Registration successful! Check your email to verify your account.
 *       400:
 *         description: Invalid data
 *       409:
 *         description: Username is already taken
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: This username is already in use.
 *       500:
 *         description: error
 *        
 */


router.post('/register', schemaValidate(authValidator.authRegister), authControllers.register);

// login  

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Login an existing user
 *     tags: [USE]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 required:
 *                   - username
 *                   - password
 *                   - email
 *                 properties:
 *                   username:
 *                     type: string
 *                     example: qwx
 *                   password:
 *                     type: string
 *                     example: password
 *                   email:
 *                     type: string
 *                     example: example@gmail.com
 *                   firstName:
 *                     type: string
 *                     example: name
 *                   lastName:
 *                     type: string
 *                     example: surname
 *                   avatarUrl:
 *                     type: string
 *                     example: https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png
 *                   balance: 
 *                     type: number
 *                     example: 0
 *                   totalIncome: 
 *                     type: number
 *                     example: 0
 *                   totalSpend: 
 *                     type: number
 *                     example: 0
 *                   limitForThisMonth: 
 *                     type: number
 *                     example: 0
 *                   spendThisMonth: 
 *                     type: number
 *                     example: 0
 *                   incomeThisMonth: 
 *                     type: number
 *                     example: 0
 *                   expenses: 
 *                     type: array
 *                     items:
 *                       type: object
 *                     example: [{}]
 *                   isVerified: 
 *                     type: boolean
 *                     example: true
 *                   verificationToken: 
 *                     type: string
 *                     example: dsuq38ehquhfdsundqmqj8usdu8aUDWUAudhqudb
 *                   _id: 
 *                     type: string
 *                     example: 68be2e57d3e1e9a8efc7fd6c
 *                   createdAt: 
 *                     type: string
 *                     format: date-time
 *                     example: 2025-09-08T01:16:07.252Z
 *                   updatedAt: 
 *                     type: string
 *                     format: date-time
 *                     example: 2025-09-08T01:16:07.252Z
 *                   fullName: 
 *                     type: string
 *                     example: name surname
 *                   id: 
 *                     type: string
 *                     example: 68be2e57d3e1e9a8efc7fd6c
 *               token:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               message:
 *                 type: string
 *                 example: Registration successful! Check your email to verify your account.
 *     responses:
 *       200:
 *         description: User registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             properties:
 *               user:
 *                 type: object
 *                 required:
 *                   - username
 *                   - password
 *                   - email
 *                 properties:
 *                   username:
 *                     type: string
 *                     example: qwx
 *                   password:
 *                     type: string
 *                     example: password
 *                   email:
 *                     type: string
 *                     example: example@gmail.com
 *                   firstName:
 *                     type: string
 *                     example: name
 *                   lastName:
 *                     type: string
 *                     example: surname
 *                   avatarUrl:
 *                     type: string
 *                     example: https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png
 *                   balance: 
 *                     type: number
 *                     example: 0
 *                   totalIncome: 
 *                     type: number
 *                     example: 0
 *                   totalSpend: 
 *                     type: number
 *                     example: 0
 *                   limitForThisMonth: 
 *                     type: number
 *                     example: 0
 *                   spendThisMonth: 
 *                     type: number
 *                     example: 0
 *                   incomeThisMonth: 
 *                     type: number
 *                     example: 0
 *                   expenses: 
 *                     type: array
 *                     items:
 *                       type: object
 *                     example: [{}]
 *                   isVerified: 
 *                     type: boolean
 *                     example: true
 *                   verificationToken: 
 *                     type: string
 *                     example: dsuq38ehquhfdsundqmqj8usdu8aUDWUAudhqudb
 *                   _id: 
 *                     type: string
 *                     example: 68be2e57d3e1e9a8efc7fd6c
 *                   createdAt: 
 *                     type: string
 *                     format: date-time
 *                     example: 2025-09-08T01:16:07.252Z
 *                   updatedAt: 
 *                     type: string
 *                     format: date-time
 *                     example: 2025-09-08T01:16:07.252Z
 *                   fullName: 
 *                     type: string
 *                     example: name surname
 *                   id: 
 *                     type: string
 *                     example: 68be2e57d3e1e9a8efc7fd6c
 *               token:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               message:
 *                 type: string
 *                 example: Registration successful! Check your email to verify your account.
 *       400:
 *         description: Invalid data
 *       409:
 *         description: Username is already taken
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: This username is already in use.
 *       500:
 *         description: error
 *        
 */


router.post('/login', schemaValidate(authValidator.authLogin), authControllers.login);

// get current user 

router.get('/me', auth, authControllers.me);

// verify email token 

router.get('/verify/:token', authControllers.verify);

// change user

router.patch("/:id", auth, authControllers.changeUserDate);

// server info 

router.get("/info", (req, res) => {
    const status = {
      "Status": "Running"
    };

    res.send(status);
});

module.exports = router;