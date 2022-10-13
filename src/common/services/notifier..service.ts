import nodemailer, { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export class NotifierService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  notify(
    email: string,
    message: string,
    subject: string,
    from: string = "test@green-test.com"
  ) {
    return new Promise((resolve, reject) => {
      const otps = {
        from,
        to: email,
        subject: subject,
        text: message,
      };

      this.transporter.sendMail(otps, (error, info) => {
        if (error) {
          return reject(error);
        }
        return resolve(info);
      });
    });
  }
}
