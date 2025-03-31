import { EmailCertType } from '../model/email-cert-type';

/**
 * @author jochongs
 */
export class InsertEmailCertCodeInput {
  type: EmailCertType;
  email: string;
  code: string;
}
