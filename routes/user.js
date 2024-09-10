const express = require("express");
const router = express.Router();
const csrf = require("csurf");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
const Product = require("../models/product");
const Order = require("../models/order");
const Cart = require("../models/cart");
const middleware = require("../middleware");
const {sendVerificationEmail}  = require("../service/email");
const {
  userSignUpValidationRules,
  userSignInValidationRules,
  validateSignup,
  validateSignin,
  validateVerificationCode
} = require("../config/validator");
const { fa } = require("faker/lib/locales");
const csrfProtection = csrf();
router.use(csrfProtection);


// GET: display the signup form with csrf token


router.get("/signup", middleware.isNotLoggedIn, (req, res) => {
  var errorMsg = req.flash("error")[0];
  res.render("user/signup", {
    csrfToken: req.csrfToken(),
    errorMsg,
    pageName: "Sign Up",
  });
});
// POST: handle the signup logic
router.post(
  "/signup",
  [
    middleware.isNotLoggedIn,
    userSignUpValidationRules(),
    validateSignup, 
    validateVerificationCode,
    passport.authenticate("local.signup", {
      successRedirect: "/user/profile",
      failureRedirect: "/user/signup",
      failureFlash: true,
    }),
  ],
  async (req, res) => {
    try {
      //if there is cart session, save it to the user's cart in db
      if (req.session.cart) {
        const cart = await new Cart(req.session.cart);
        cart.user = req.user._id;
        await cart.save();
      }

      // redirect to the previous URL
      if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
      }  
      else {
        res.redirect("/user/profile");
      }
    } catch (err) {
      console.log(err);
      req.flash("error", err.message);
      return res.redirect("/");
    }
  }
);
router.get("/signupmail", (req, res) => 
{
  var errorMsg = req.flash("error")[0];
  res.render("user/signupmail", {
    csrfToken: req.csrfToken(),
    errorMsg,
    pageName: "Sign Up",
  });
});
router.post("/signupmail",
 async (req, res) => {
 try {
  const { email } = req.body;
  console.log(email);
  sendVerificationEmail(email);
  res.redirect("/user/signup"); // Redirect to success page
} catch (err) {
  console.error("Error sending verification email:", err);
  req.flash("error", "There was a problem sending the verification email. Please try again.");
  res.redirect("/user/signupmail"); // Redirect back to signup form
}
}
);
// GET: display the signin form with csrf token
router.get("/signin", middleware.isNotLoggedIn, async (req, res) => {
  var errorMsg = req.flash("error")[0];
  res.render("user/signin", {
    csrfToken: req.csrfToken(),
    errorMsg,
    pageName: "Sign In",
  });
});

// POST: handle the signin logic
router.post(
  "/signin",
  [
    middleware.isNotLoggedIn,
    userSignInValidationRules(),
    validateSignin,
    passport.authenticate("local.signin", {
      failureRedirect: "/user/signin",
      failureFlash: true,
    }),
  ],
  async (req, res) => {
    try {
      // cart logic when the user logs in
      let cart = await Cart.findOne({ user: req.user._id });
      // if there is a cart session and user has no cart, save it to the user's cart in db
      if (req.session.cart && !cart) {
        const cart = await new Cart(req.session.cart);
        cart.user = req.user._id;
        await cart.save();
      }
      // if user has a cart in db, load it to session
      if (cart) {
        req.session.cart = cart;
      }
      // redirect to old URL before signing in
      if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
      } else {
        res.redirect("/user/profile");
      }
    } catch (err) {
      console.log(err);
      req.flash("error", err.message);
      return res.redirect("/");
    }
  }
);

// GET: display user's profile
router.get("/profile", middleware.isLoggedIn, async (req, res) => {
  const successMsg = req.flash("success")[0];
  const errorMsg = req.flash("error")[0];
  try {
    // find all orders of this user
    allOrders = await Order.find({ user: req.user });
    res.render("user/profile", {
      orders: allOrders,
      errorMsg,
      successMsg,
      pageName: "User Profile",
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});

// GET: logout
router.get("/logout", middleware.isLoggedIn, (req, res) => {
  req.logout();
  req.session.cart = null;
  res.redirect("/");
});
module.exports = router;

