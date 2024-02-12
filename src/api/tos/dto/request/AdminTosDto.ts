export class TosDto<
  T extends { contents: undefined | string } = { contents: undefined },
> {
  idx: number;
  title: string;
  contents: T['contents'];
  isEssential: boolean;
  createdAt: Date;
  updatedAt: Date;
}
