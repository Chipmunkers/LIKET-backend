import { EmailCertType } from '../model/email-cert-type';

/**
 * @author jochongs
 */
export class SelectEmailCertCodeInput {
  email: string;
  timeLimit: Date;
  type: EmailCertType;
}
