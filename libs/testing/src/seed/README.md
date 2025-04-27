# Seed Helper 컨벤션

데이터 시딩에 대해서 설명하는 문서입니다.

## Seed Helper란

데이터베이스에 손쉽게 시딩할 수 있도록 도와주는 `class`를 의미합니다.
모든 시드 헬퍼 클래스는 `ISeedHelper` 추상 클래스를 extend하여 만들어야합니다.

자세한 내용은 아래 `Seed Helper 만드는 방법`를 참고하세요.

## Seed Helper 만드는 방법

아래 문서는 사용자 시딩 헬퍼 클래스를 만드는 경우를 예시로 설명되어 있습니다.

1. **src/seed 디렉토리에 도메인 명을 가진 디렉토리를 생성합니다.**

   ```bash
   # seed 디렉토리에 user라는 디렉토리를 생성
   # src/seed/user
   mkdir user
   ```

2. **input, output 타입을 생성합니다.**

   user디렉토리에 type디렉토리를 만들어, input 과 output 타입을 담는 파일을 생성합니다.

   ```bash
   # type 디렉토리 생성
   mkdir ./user/type

   # src/seed/user/type/user.input.ts
   touch ./user/type/user.input.ts

   # src/seed/user/type/user.output.ts
   touch ./user/type/user.output.ts
   ```

3. **input과 output 타입을 완성합니다.**

- **input**

  시드 데이터를 생성하기 필요한 데이터 타입입니다. 반드시 명시해야할 필요가 있는 데이터를 제외한 모든 데이터는 optional하게 들어가야합니다. 명시되지 않은 값은 자동으로 랜덤 값으로 들어가야하기 때문입니다.

  null이 될 수 있는 모든 값은 optional일 경우 null이 된다는 점을 기억해야합니다.

* **output**

  시드 데이터가 생성된 후, 반환할 데이터 타입입니다.

4. **seed helper를 생성합니다.**

   파일을 생성합니다.

   ```bash
   # src/seed/user/user-seed.helper.ts
   touch ./user/user-seed.helper.ts
   ```

   그 후, 3번 과정에서 생성한 `input`, `output` 타입과 함께 상속할 타입을 명시합니다.

   ```ts
   export class UserSeedHelper extends ISeedHelper<UserInput, UserOutput> {
     public seed(input: UserInput): Promise<Output> {}
   }
   ```

   그 후, seed 메서드를 구현합니다.

5. **seed 메서드 규칙**

   seed 메서드는 `input`을 통해 데이터를 시딩한 후, `output`결과를 반환하는 메서드입니다.
   구현 규칙을 반드시 지켜주세요.

   1. nullable한 값은 모두, null이 될 수 있도록 구현합니다.
   2. optional한 값은 전부, 랜덤하게 들어갈 수 있도록 구현합니다.
