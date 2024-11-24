# LIKET

![notion_mockup](https://github.com/user-attachments/assets/775f4e0e-83de-4054-9a8b-567b33ae672e)

> 라이켓은 다양한 문화생활 정보를 공유하고 나만의 문화생활 기록을 남길 수 있는 서비스를 제공하고 있습니다.
> 태그별, 지역별로 관심있는 정보들만 골라보고 쉽게 문화생활을 즐겨보세요.

사이트 바로가기: https://liket.site

## Repository Description

> LIKET 백엔드 레포지토리는 모노레포로 구성되어있습니다. 작업할 디렉토리를 헷갈리지 않도록 주의해주세요!

LIKET은 `Nest.js`와 `Prisma`를 메인으로 사용합니다. 모든 앱이 키져야하는 공통 컨벤션이 존재합니다.

1. Controller, Service, Repository 패턴을 만족시켜야함
2. Prisma로부터 생성된 모델은 Service레이어에서 Entity로 가공되어야함
3. 500을 제외한, 각 API에서 응답하는 상태코드는 반드시 명세서에 명시되어야함
4. 각 앱에는 반드시 하나의 README.md 파일을 통해 앱 설명을 포함해야함

그 외의 컨벤션은 각 앱에서 자유롭게 정할 수 있습니다.

## Commit Rules

1. `feat`, `chore`, `style`, `refactor`, `test`로 커밋 단위를 나누어야합니다.
2. `user-server`, `admin-server`, `batch-server`, `libs`, `common`으로 코드 변경 스코프를 명시합니다.
3. 대문자 구분이 필요한 경우 제일 첫 글자를 대문자로 하십시오.

**Example**

```
feat(admin-server): Implement GET /user API
```

## Merge Rules

### 1. `master` Branch

master 브랜치에는 Version Up에만 머지하는 것을 **강력히 권장**합니다.

단일 어플리케이션 Version Up일 때는

```
Merge({#PR번호}): {app-name}: {version}
```

여러 어플리케이션 Version Up일 때는

```
Merge({#PR번호}): {app-name}: {version}, {app-name}: {version}, ...
```

그러나, 여러 어플리케이션 Version Up은 최대한 피하십시오.

> 작업자가 많아진다면 배포 전략을 `branch push`기반이 아닌 `tag`기반으로 변경해야합니다.

**Example**

```
Merge(#13): user-server: 1.0.0
```

### 2. `develop` Branch

`Issue`단위로 작업할 것을 권장합니다. 그러나 단순한 기능 단위로도 머지할 수 있습니다.

```
Merge({PR 번호}): {prefix}({app-name}) {message}
```

`prefix`는 feat, chore, refactor 등을 의미합니다.

`app-name`는 작업한 app의 이름을 의미합니다. 공용 작업 또는 라이브러리 변경의 경우 `common`으로 통일합니다.

`message`는 반드시 커밋 규칙을 지켜야하며 해당 PR의 주제를 작성해야합니다.

> master, develop 브랜치 외의 모든 머지는 커밋 규칙을 지켜 자유롭게 가능합니다.

## Infrastructure & Deploy

개발 서버는 홈 서버를 통해 배포합니다. 그러나 프로덕션 서버는 ECS에 배포된다는 것을 명심해야합니다. `batch-server`를 제외한 모든 앱은 다중 컨테이너 환경에서 고가용성있게 운영된다는 점을 주의하여 개발해야합니다.

> Redis, ES에 접근하는 컨테이너는 절대 한 개가 아닙니다. 동시성에 주의하여 개발해야합니다.

## To Developers

특정 예외사항을 위해 lint를 통해 포맷을 강제하고 있지 않습니다. 그러나 대부분에 상황에서 prettier에 의존하는 것을 권장합니다.

> lint를 강제하지 않기 때문에 PR 또는 Merge시 lint 에러를 잡지 않습니다.

개발 환경 설정 및 컨벤션은 각 앱 `README.md`에서 확인할 수 있습니다. 모노레포 구조에 대한 설명을 이해하셨다면 각 앱의 `README.md`를 읽은 후 작업해주시길 바랍니다.

`ERD Editor`익스텐션을 설치해야 `table.erd.json`파일을 통해 ERD를 시각화할 수 있습니다. 그 외에도, `Prisma`, `Prettier - Code formatter` 설치를 권장합니다.

### [🖇️ user-server 바로가기](https://github.com/Chipmunkers/LIKET-backend/tree/master/apps/user-server)

### [🖇️ admin-server 바로가기](https://github.com/Chipmunkers/LIKET-backend/tree/master/apps/admin-server)

### [🖇️ batch-server 바로가기]()

## Directory Description

프로젝트 루트(이하 루트)에는 모든 앱이 사용하는 기본 설정파일이 담겨있습니다.

> 해당 레포는 모든 앱이 Nest.js를 사용하는 모노레포입니다.

### 1. apps

모든 Nest.js 앱이 위치하는 디렉토리입니다.

### 2. libs

모든 Nest.js 라이브러리가 위치하는 디렉토리입니다.

### 3. scripts

실행 파일 또는 실행을 위한 `Dockerfile`이 위치한 곳입니다. 그러나 각 앱의 배포 `Dockerfile`은 각 앱의 루트 디렉토리에 위치하는 것을 강제합니다.

### 4. prisma

모든 앱이 사용하는 `prisma.schema` 설정 파일이 존재하는 디렉토리입니다. 해당 파일의 변경 권한은 메인테이너에게 있습니다.

### 5. table.erd.json

RDB ERD를 볼 수 있는 파일입니다. 변경되지 않도록 주의해야합니다.

## Contribute

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/jochongs">
        <img src="https://github.com/jochongs.png" width="100px;" alt="Kyeong Chan Min" style="border-radius: 100%;border:2px solid white" />
        <br />
        <sub>
          <b>KyeongChan Min</b>
        </sub>
      </a>
      <br />
      <span>Maintainer</span>
      <br />
    </td>
    <td align="center">
      <a href="https://github.com/wherehows">
        <img src="https://github.com/wherehows.png" width="100px;" alt="Younghoo Kim" style="border-radius: 100%;border:2px solid white" />
        <br />
        <sub>
          <b>Younghoo Kim</b>
        </sub>
      </a>
      <br />
      <span>Contributor</span>
      <br />
    </td>
  </tr>
</table>

![banner](https://github.com/user-attachments/assets/bfafbb47-3323-49f6-9c87-c8bf2edc7c29)
