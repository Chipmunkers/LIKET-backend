import nodemailer from 'nodemailer';
import env from '../config/env';

export const sendEmail = async (toEmail: string, subject: string, contents: string) => {
    return new Promise((resolve, reject) => {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            auth: {
                user: env.gmailUser,
                pass: env.gmailPassword
            }
        });

        const emailOption = {
            from: env.gmailUser,
            to: toEmail,
            subject: subject,
            html: contents
        }

        transport.sendMail(emailOption, (err, info) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(1);
        });
    });
}
