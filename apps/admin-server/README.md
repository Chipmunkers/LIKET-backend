# LIKET user-server

![notion_mockup](https://github.com/user-attachments/assets/775f4e0e-83de-4054-9a8b-567b33ae672e)

> 라이켓은 다양한 문화생활 정보를 공유하고 나만의 문화생활 기록을 남길 수 있는 서비스를 제공하고 있습니다.
> 태그별, 지역별로 관심있는 정보들만 골라보고 쉽게 문화생활을 즐겨보세요.

사이트 바로가기: https://liket.site

## Description

백오피스 API를 담고있는 서버입니다.

## Convention

1. Controller 레이어에서 Prisma model을 사용하지 마십시오.
2. PrismaClient는 repository 레이어에서 사용하십시오.
3. Prisma에서 생성된 Model과 구분하기 위해 모든 모델은 Entity라 칭해야합니다.

## Required For Develop

1. Node.js 20 버전 이상
2. Docker 20 버전 이상

> **주의**: `docker-compose` CLI를 사용하는 도커 버전에서는 대부분의 npm script에서 에러가 발생합니다.
