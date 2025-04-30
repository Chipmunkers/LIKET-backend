export class InstagramFeedEntity {
  /**
   * 피드 내용
   */
  public caption: string;

  /**
   * 피드 이미지 URL
   */
  public images: string[];

  constructor(data: InstagramFeedEntity) {
    Object.assign(this, data);
  }

  public static from(data: InstagramFeedEntity): InstagramFeedEntity {
    return new InstagramFeedEntity({
      caption: data.caption,
      images: data.images,
    });
  }
}
