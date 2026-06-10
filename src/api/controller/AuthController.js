const {
    singUpService,
    userExistByEmailService,
    logOutService,
    userExistService
} = require('../service/UserService');
const jwt = require('jsonwebtoken');
const { validateUser } = require('../controller/UserController');
const { checkPassword } = require('../validate/dbCheck');
const {
    nameValidate,
    emailValidate,
    passwordValidate
} = require('../validate/syntaxCheck');
const { response, logInResponse } = require('../helper/response');
const UserDTO = require('../dto/UserDTO');

exports.authMeController = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) return res.status(401).json({ success: false });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userExistService(decoded._id);
        if (!user) return res.status(401).json({ success: false });

        return res.status(200).json({ success: true, user: new UserDTO(user) });
    } catch (err) {
        res.status(401).json({ success: false });
    }
}

exports.logInController = async (req, res, next) => {

    try {

        const {
            email,
            password
        } = req.body;

        if (!emailValidate(email)) {
            throw new Error("Incorrect email form");
        }

        if (!passwordValidate(password)) {
            throw new Error("Incorrect password form");
        }

        const userCheck = await validateUser(
            email,
            password
        );

        return res.status(200).json({
            success: true,
            user: new UserDTO(userCheck)
        });

    } catch (err) {
        next(err);
    }
};

exports.logInController2 = async (req, res, next) => {
    try {

        const {
            email,
            password
        } = req.body;

        if (!emailValidate(email)) {
            throw new Error("Incorrect email form");
        }

        if (!passwordValidate(password)) {
            throw new Error("Incorrect password form");
        }

        const userCheck = await validateUser(email, password);

        const token = jwt.sign(
            { _id: userCheck._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none', // 'strict' bloqueaba la cookie en el refresh de página
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            user: new UserDTO(userCheck)
        });
    } catch (err) { next(err); }
};

exports.signUpController = async (req, res, next) => {
    try {

        const { firstName, lastName, email, password } = req.body;

        if (!nameValidate(firstName)) throw new Error("Incorrect firstName form");
        if (!nameValidate(lastName)) throw new Error("Incorrect lastName form");
        if (!emailValidate(email)) throw new Error("Incorrect email form");
        if (!passwordValidate(password)) throw new Error("Incorrect password form");

        if (await userExistByEmailService(email)) throw new Error("Email used already has an account");

        const userCreated = await singUpService(firstName, lastName, email, password);

        return res.status(201).json({
            success: true,
            user: userCreated
        });

    } catch (err) {
        next(err);
    }
};

exports.logOutController = async (req, res, next) => {
    try {
        logOutService();
        res.clearCookie('token');
        return res.status(200).json({ success: true });
    } catch (err) {
        next(err);
    }
};
