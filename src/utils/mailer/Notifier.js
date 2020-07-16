import { transporter } from './NodeMailer';
import { beautifyDate } from '../DateBeautifier';

class Notifier {
    static NotifyUnauthorizedWithdrawAccess (customer, account) {
        const notifyDate = beautifyDate(new Date());
        const html = `<div>
        <p>Hello ${customer.name},</p>
        <p>We noticed a suspicious withdrawal attempt on your account
          with number: "${account.accountNo}" and name: "${account.name}" on ${notifyDate}.
        </p>
        <p>We just want to keep you notified.</p>
        <p>Remember not to share your login details with anyone.</p>
        <br />
        Best Regards
        </div>`;

        const subject = 'Security Alert';
        const to = customer.email;

        const mailOptions = this.GenerateMailOptions(to, subject, html);

        transporter.sendMail(mailOptions);
    }

    static GenerateMailOptions (to, subject, html) {
        return {
            from: '"WBank Notification System" <wbankapp@protonmail.com>',
            to,
            subject,
            html,
        }
    }
}

export default Notifier;
