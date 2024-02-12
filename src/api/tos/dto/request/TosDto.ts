export class TosDto<T extends { contents: string } = { contents: undefined }> {
  idx: number;
  title: string;
  contents: T['contents'];
  isEssential: boolean;
}
