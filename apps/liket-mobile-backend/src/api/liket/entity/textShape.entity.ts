import { IsNumber, IsString, Length, Matches } from 'class-validator';

export class TextShapeEntity {
  /**
   * 6 자리 또는 3 자리 기반의 Hex 컬러 코드
   *
   * @example "#f5d949" 혹은 "#f00"
   */
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: '올바른 hex 컬러 코드를 입력해주세요 (예: #FF0000 또는 #F00)',
  })
  public fill: string;

  /**
   * 텍스트 내용
   *
   * @example "별이 빛나는 밤에"
   */
  @IsString()
  @Length(1, 18)
  public text: string;

  /**
   * 텍스트 가로 위치
   *
   * @example 108
   */
  @IsNumber()
  public x: number;

  /**
   * 텍스트 세로 위치
   *
   * @example 209
   */
  @IsNumber()
  public y: number;

  constructor(data: TextShapeEntity) {
    Object.assign(this, data);
  }

  static createEntity(data: TextShapeEntity) {
    return new TextShapeEntity({
      fill: data.fill,
      text: data.text,
      x: data.x,
      y: data.y,
    });
  }

  static isSameStructure(obj: unknown): obj is TextShapeEntity {
    if (typeof obj !== 'object' || obj === null) {
      return false;
    }

    const { fill, text, x, y } = obj as TextShapeEntity;

    const hasFill = typeof fill === 'string';
    const hasText =
      typeof text === 'string' && text.length >= 1 && text.length <= 18;
    const hasX = typeof x === 'number';
    const hasY = typeof y === 'number';

    return hasFill && hasText && hasX && hasY;
  }
}
