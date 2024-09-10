const { check, validationResult } = require("express-validator");
const VerificationCode = require("../models/verificationCode");
const errors = require("admin-bro-mongoose/src/utils/errors");


const userSignUpValidationRules = () => {
  return [
    check("name", "Name is required").not().isEmpty(),
    check("password", "Please enter a password with 6 or more characters")
      .not()
      .isEmpty()
      .isLength({ min: 6, max: 15},)
      .matches(/[\W_]/, "i").withMessage("Password must contain at least one special character"),
  ];
};

const userSignInValidationRules = () => {
  return [
    check("email", "Invalid email").not().isEmpty().isEmail(),
    check("password", "Invalid password").not().isEmpty().isLength({ min: 6, max: 16}),
  ];
};

const userContactUsValidationRules = () => {
  return [
    check("name", "Please enter a name").not().isEmpty(),
    check("email", "Please enter a valid email address")
      .not()
      .isEmpty()
      .isEmail(),
    check("message", "Please enter a message with at least 10 words")
      .not()
      .isEmpty()
      .isLength({ min: 10 }),
  ];
};

const validateVerificationCode = async (req, res, next) => {
  try {
    const verificationCodeDoc = await VerificationCode.findOne({}).sort({ _id: -1 });
    if (!verificationCodeDoc) {
      req.flash("error", "Invalid verification code or email");
      await VerificationCode.deleteCode(generatedCode);
      return res.redirect("/user/signupmail"); // Or appropriate error page
    }
    const generatedCode = verificationCodeDoc.code;
    const userCode = req.body.verificationCode;
    console.log(generatedCode);
    console.log(userCode);

    if (generatedCode !== userCode) {
      req.flash("error", "Invalid verification code"); // Flash an error message
      await VerificationCode.deleteCode(generatedCode);
      return res.redirect("/user/signupmail"); // Redirect to the signup mail page or appropriate error page
    }
    next(); // Proceed to the next middleware or route handler
    await VerificationCode.deleteCode(generatedCode);
  } catch (error) {
    console.log('Error occurred while validating verification code:', error);
    req.flash("error", "An error occurred"); // Flash an error message
    return res.redirect("/user/signupmail"); // Redirect to the signup mail page or appropriate error page
  }
};


const validateSignup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var messages = [];
    errors.array().forEach((error) => {
      messages.push(error.msg);
    });
    req.flash("error", messages);
    return res.redirect("/user/signup");
  }
  next();
};

const validateSignin = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var messages = [];
    errors.array().forEach((error) => {
      messages.push(error.msg);
    });
    req.flash("error", messages);
    return res.redirect("/user/signin");
  }
  next();
};

const validateContactUs = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var messages = [];
    errors.array().forEach((error) => {
      messages.push(error.msg);
    });
    console.log(messages);
    req.flash("error", messages);
    return res.redirect("/pages/contact-us");
  }
  next();
};

module.exports = {
  userSignUpValidationRules,
  userSignInValidationRules,
  userContactUsValidationRules,
  validateSignup,
  validateSignin,
  validateContactUs,
  validateVerificationCode
};
