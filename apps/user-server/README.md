# LIKET user-server

![notion_mockup](https://github.com/user-attachments/assets/775f4e0e-83de-4054-9a8b-567b33ae672e)

> 라이켓은 다양한 문화생활 정보를 공유하고 나만의 문화생활 기록을 남길 수 있는 서비스를 제공하고 있습니다.
> 태그별, 지역별로 관심있는 정보들만 골라보고 쉽게 문화생활을 즐겨보세요.

사이트 바로가기: https://liket.site

## Description

사용자 서버의 모든 API가 담긴 서버입니다. ECS를 통해 고가용성있게 배포되어 있습니다. 다중 컨테이너 환경에서 배포되어있다는 점을 주의합시다.

## Convention

해당 앱은 다응의 컨벤션을 반드시 따라야합니다.

1. Controller 레이어에서 Prisma model을 사용하지 마십시오.
2. PrismaClient는 repository 레이어에서 사용하십시오.
3. Prisma에서 생성된 Model과 구분하기 위해 모든 모델은 Entity라 칭해야합니다.

## Required For Develop

1. Node.js 20 버전 이상
2. Docker 20버전 이상

> **주의**: `docker-compose` CLI를 사용하는 도커 버전에서는 대부분의 npm script에서 에러가 발생합니다.

## Develop Setup

### 1. 인프라 구성

아래 명령어를 통해 인프라를 도커를 통해 띄웁니다.

```
npm run user-server:dev:infra:up
```

### 2. 환경변수 작성

루트에 `.env` 파일을 통해 환경변수를 준비합니다.

### 3. 앱 실행

앱을 실행합니다.

```
npm run start {app_name} --watch
```

> `npm run user-server:dev:infra:down`을 통해 개발 인프라를 내릴 수 있습니다.

## Test Setup

### 1. 인프라 구성

아래 명령어를 통해 인프라를 도커를 통해 띄웁니다.

```
npm run user-server:test:infra:up
```

### 2. 테스트 실행

테스트를 실행합니다. 만약 특정 테스트 코드 파일만 실행하기를 원할 경우 명령어 뒤에 파일 경로를 지정할 수 있습니다.

```
npm run user-server:test:e2e
```

> `npm run user-server:test:infra:down`을 통해 테스트 인프라를 내릴 수 있습니다.

![banner](https://github.com/user-attachments/assets/bfafbb47-3323-49f6-9c87-c8bf2edc7c29)
