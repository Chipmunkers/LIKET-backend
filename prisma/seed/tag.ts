import { prisma } from './prisma';

export const upsertStyle = async () => {
  const styles = [
    { idx: 13, name: '힐링' },
    { idx: 12, name: '편안한' },
    { idx: 11, name: '미니멀' },
    { idx: 9, name: '힙한' },
    { idx: 10, name: '세련된' },
    { idx: 8, name: '귀여운' },
    { idx: 7, name: '재미있는' },
    { idx: 6, name: '굿즈' },
    { idx: 5, name: '체험' },
    { idx: 4, name: '포토존' },
    { idx: 3, name: '반려동물' },
    { idx: 2, name: '함께' },
    { idx: 1, name: '혼자' },
  ];

  await Promise.all(
    styles.map((style) =>
      prisma.style.upsert({
        where: {
          idx: style.idx,
        },
        create: style,
        update: style,
      }),
    ),
  );
};

export const upsertGenre = async () => {
  const genres = [
    { idx: 6, name: '페스티벌' },
    { idx: 5, name: '콘서트' },
    { idx: 4, name: '뮤지컬' },
    { idx: 3, name: '연극' },
    { idx: 2, name: '전시회' },
    { idx: 1, name: '팝업스토어' },
  ];

  await Promise.all(
    genres.map((genre) =>
      prisma.genre.upsert({
        where: {
          idx: genre.idx,
        },
        create: genre,
        update: genre,
      }),
    ),
  );
};

export const upsertAge = async () => {
  const ages = [
    { idx: 6, name: '40-50대' },
    { idx: 5, name: '30대' },
    { idx: 4, name: '20대' },
    { idx: 3, name: '10대' },
    { idx: 2, name: '아이들' },
    { idx: 1, name: '전체' },
  ];

  await Promise.all(
    ages.map((age) =>
      prisma.age.upsert({
        where: {
          idx: age.idx,
        },
        create: age,
        update: age,
      }),
    ),
  );
};
