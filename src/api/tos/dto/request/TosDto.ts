export class TosDto<T extends { contents: string } = { contents: string }> {
  idx: number;
  title: string;
  contents: T['contents'];
  isEssential: boolean;
}
