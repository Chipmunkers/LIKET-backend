import { Controller } from '@nestjs/common';
import { AnswerService } from './answer.service';

@Controller('/inquiry')
export class InquiryAnswerController {
  constructor(private readonly answerService: AnswerService) {}

  /**
   * Get inquiry answer by idx API
   * @summary Get inquiry answer by idx API
   *
   * @tag Inquiry-Answer
   */
  public async getInquiryByIdx() {}

  /**
   * Create answer API
   * @summary Create answer API
   *
   * @tag Inquiry-Answer
   */
  public async createAnswer() {}

  /**
   * Update answer API
   * @summary Inquiry-Answer
   *
   * @tag Inquiry-Answer
   */
  public async updateAnswer() {}

  /**
   * Delete answer API
   * @summary Delete answer API
   *
   * @tag Inquiry-Answer
   */
  public async deleteAnswer() {}
}
