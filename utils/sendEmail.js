import nodemailer from "nodemailer"
import paths from "path"
import ejs from "ejs"
import dotenv from 'dotenv'

dotenv.config();

// const { EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD } = process.env;
const transport = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "tezonteam@gmail.com",
    pass: "huse yvui thji siho"
    // user: process.env.MEDINFO_EMAIL,
    // pass: process.env.MEDINFO_EMAIL_PASSWORD
  }
});

export const sendEmail = (receiver, name, subject, content, directory) => {
  ejs.renderFile(
    directory,
    { content, name },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        var mailOptions = {
          from: "MEDINFO",
          to: receiver,
          subject: subject,
          html: data,
        };

        transport.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Message sent: %s", info);
        });
      }
    }
  );
};

export const sendAppointmentMail = (doctorEmail, patientEmail, reason, meetingLink, date) => {
    
  var mailOptions = { 
    from: 'MedInfo Nigeria',
    to:  `${doctorEmail}, ${patientEmail}`,
    subject: `Appointment Scheduled for ${reason}`,
    html: `<p>Hello!</p>
    <p>This is to inform you of your appointment scheduled for ${date}</p>
    <p>Please click on the link on the date of your appointment to access the virtual meeting room: ${meetingLink}</p>
    `  
  }

  transporter.sendMail(mailOptions, (err, info)=>{
    if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info);
  })  
}  




