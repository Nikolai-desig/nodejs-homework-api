const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
    const email = {...data, from: "rinzleramad79@gmail.com"};
    await sgMail.send(email);
    return true;
}

module.exports = sendEmail

// const email = {
//   to: "morec32496@kkoup.com",
//   from: "rinzleramad79@gmail.com",
//   subject: "Test email",
//   html: "<p><strong>Test eamil</strong> from localhost:3000</p>",
// };

// sgMail
//   .send(email)
//   .then(() => console.log(error.message))
//   .catch((error) => console.log(error.message));
