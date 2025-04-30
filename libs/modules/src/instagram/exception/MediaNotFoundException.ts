export class MediaNotFoundException extends Error {
  constructor(mediaId: string) {
    super(`Media not found: ${mediaId}`);
    this.name = 'MediaNotFoundException';
  }
}
