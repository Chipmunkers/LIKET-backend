import { EmailCertType } from '../model/email-cert-type';

/**
 * @author jochongs
 */
export interface IEmailCertService {
  sendCertCode: (toEmail: string, type: EmailCertType) => Promise<void>;

  checkCertCode: (
    email: string,
    code: string,
    type: EmailCertType,
  ) => Promise<string>;
}
