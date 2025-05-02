export class InstagramFeedEntity {
  /**
   * 피드 내용
   */
  public caption: string;

  /**
   * 피드 이미지 URL
   */
  public images: string[];

  /**
   * 피드 생성 시간
   */
  public createdAt: Date;

  constructor(data: InstagramFeedEntity) {
    Object.assign(this, data);
  }

  public static from(data: InstagramFeedEntity): InstagramFeedEntity {
    return new InstagramFeedEntity({
      caption: data.caption,
      images: data.images,
      createdAt: data.createdAt,
    });
  }
}
