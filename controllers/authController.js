const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs")

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login ",
    currentPage: "login",
    isLoggedIn: false,
    errors: [],
    oldInput: {
      email: "",
      password: "",
    },  
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    currentPage: "signup",
    isLoggedIn: false,
    errors: [],
    oldInput: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      userType: "",
    },
  });
};

exports.postSignup = [
  check("firstName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First character at least 2 character long")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("First Name sgould contain only alphabets"),

  check("lastName")
    .matches(/^[A-Za-z\s]*$/)
    .withMessage("Last Name sgould contain only alphabets"),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 character long")
    .matches(/[A-Z]/)
    .withMessage("Password should be at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password should be at least one lowercase lettter")
    .matches(/[0-9]/)
    .withMessage("Password should be at least one number")
    .matches(/[!@&]/)
    .withMessage("Password must contain at least one special  character")
    .trim(),

  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password do not match");
      }
      return true;
    }),

  check("userType")
    .notEmpty()
    .withMessage("Please select user type")
    .isIn(["guest", "host"])
    .withMessage("Invalid user type"),

  check("terms")
    .notEmpty()
    .withMessage("Please acept the terms and conditions")
    .custom((value, { req }) => {
      if (value !== "on") {
        throw new Error("Please acept the terms and conditions");
      }
      return true;
    }),

  (req, res, next) => {
    const { firstName, lastName, email, password, userType } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitle: "Signup",
        currentPage: "signup",
        isLoggedIn: false,
        errors: errors.array().map(err => err.msg),
        oldInput: { firstName, lastName, email, userType },
      });
    }

    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = new User({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          userType,
        });
        return user.save();
      })
      .then(() => {
        res.redirect("/login");
      })
      .catch((err) => {
        return res.status(422).render("auth/signup", {
          pageTitle: "Signup",
          currentPage: "signup",
          isLoggedIn: false,
          errors: [err.message],
          oldInput: { firstName, lastName, email, userType },
        });
      });
  },
];

exports.postLogin = async(req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["User does not exists"],
      oldInput: { email },
    });
  }
  req.session.isLoggedIn = true;
  //   res.cookie("isLoggedIn", true);
  // req.isLoggedIn = true;
  res.redirect("/");
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
