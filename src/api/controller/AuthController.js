const {
    singUpService,
    logInService,
    userExistByEmailService,
} = require('../service/UserService');

const { validateUser } = require('../controller/UserController');

const { checkPassword } = require('../validate/dbCheck');

const {
    nameValidate,
    emailValidate,
    passwordValidate
} = require('../validate/syntaxCheck');

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
            user: {
                _id: userCheck._id,
                firstName: userCheck.firstName,
                lastName: userCheck.lastName,
                email: userCheck.email
            }
        });

    } catch (err) {
        next(err);
    }
};

exports.signUpController = async (req, res, next) => {
    try {
        console.log(req.body);

        const { firstName, lastName, email, password } = req.body;
        console.log(firstName, lastName, email, password);

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