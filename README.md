# Liket-API-Server

Liket API server with nest

## Docker 서버 배포 사용 방법

### 1. 도커 설치

[설치 링크](https://docs.docker.com/desktop/install/mac-install/)

이미 설치 되어있을 경우 스킵

```bash
docker --version
```

### 2. Backend 레포 클론

다음 명령어를 사용하여 서버 코드를 클론합니다.

```bash
git clone https://github.com/Chipmunkers/liket-mobile-backend.git
```

### 3. 도커 컴포즈 실행 명령어

PostgreSQL 실행

```bash
npm run depoly-psql:up
```

PostgreSQL 끄기

```bash
npm run deploy-psql:down
```

서버 실행

```bash
npm run dev-deploy:up
```

서버 끄기

```bash
npm run dev-deploy:down
```

## 💡안될 경우

해당 레포 관리자에게 문의하세요!
