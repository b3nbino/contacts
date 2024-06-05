const express = require("express");
const morgan = require("morgan");
const app = express();

let contactData = [
  {
    firstName: "Mike",
    lastName: "Jones",
    phoneNumber: "281-330-8004",
  },
  {
    firstName: "Jenny",
    lastName: "Keys",
    phoneNumber: "768-867-5309",
  },
  {
    firstName: "Max",
    lastName: "Entiger",
    phoneNumber: "214-748-3647",
  },
  {
    firstName: "Alicia",
    lastName: "Keys",
    phoneNumber: "515-489-4608",
  },
];

const sortContacts = (contacts) => {
  return contacts.slice().sort((contactA, contactB) => {
    if (contactA.lastName < contactB.lastName) {
      return -1;
    } else if (contactA.lastName > contactB.lastName) {
      return 1;
    } else if (contactA.firstName < contactB.firstName) {
      return -1;
    } else if (contactA.firstName > contactB.firstName) {
      return 1;
    } else {
      return 0;
    }
  });
};

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(morgan("common"));

app.get("/", (req, res) => {
  res.redirect("/contacts");
});

app.get("/contacts", (req, res) => {
  res.render("contacts", {
    contacts: sortContacts(contactData),
  });
});

app.get("/contacts/new", (req, res) => {
  res.render("new_contact");
});

app.post(
  "/contacts/new",
  (req, res, next) => {
    res.locals.errorMessages = [];
    next();
  },
  (req, res, next) => {
    if (req.body.firstName.length === 0) {
      res.locals.errorMessages.push("First name is required.");
    } else if (req.body.firstName.length > 25) {
      res.locals.errorMessages.push(
        "First name cannot be longer than 25 characters."
      );
    } else if (req.body.firstName.match(/[^a-z]/i)) {
      res.locals.errorMessages.push("First name can only contain letters.");
    }
    next();
  },
  (req, res, next) => {
    if (req.body.lastName.length === 0) {
      res.locals.errorMessages.push("Last name is required.");
    } else if (req.body.lastName.length > 25) {
      res.locals.errorMessages.push(
        "Last name cannot be longer than 25 characters."
      );
    } else if (req.body.lastName.match(/[^a-z]/i)) {
      res.locals.errorMessages.push("Last name can only contain letters.");
    }

    next();
  },
  (req, res, next) => {
    if (req.body.phoneNumber.length === 0) {
      res.locals.errorMessages.push("Phone number is required.");
    } else if (!req.body.phoneNumber.match(/\d\d\d-\d\d\d-\d\d\d\d/)) {
      res.locals.errorMessages.push(
        "Phone number must be formatted correctly."
      );
    }

    next();
  },
  (req, res, next) => {
    for (let i = 0; i < contactData.length; i++) {
      if (
        contactData[i].firstName === req.body.firstName.trim() &&
        contactData[i].lastName === req.body.lastName.trim()
      ) {
        res.locals.errorMessages.push(
          "Cannot add contact that already exists."
        );
      }
    }
    next();
  },
  (req, res, next) => {
    if (res.locals.errorMessages.length > 0) {
      res.render("new_contact", {
        errorMessages: res.locals.errorMessages,
        first: req.body.firstName,
        last: req.body.lastName,
        number: req.body.number,
      });
    } else {
      next();
    }
  },
  (req, res) => {
    contactData.push({
      firstName: req.body.firstName.trim(),
      lastName: req.body.lastName.trim(),
      phoneNumber: req.body.phoneNumber.trim(),
    });

    res.redirect("/contacts");
  }
);

app.listen(3000, "localhost", () => {
  console.log("Listening to port 3000.");
});
