import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".handlebars",
      layoutsDir: path.resolve("./templates/"),
      defaultLayout: false,
      partialsDir: path.resolve("./templates/"),
    },
    viewPath: path.resolve("./templates/"),
    extName: ".handlebars",
  }),
);

export default transporter;
