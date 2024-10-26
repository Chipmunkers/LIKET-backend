import * as fs from 'fs';
import { prisma } from './prisma';
import { join } from 'path';

interface Location {
  bjd_cd: string;
  cd: string;
  lng: string;
  lat: string;
  name: string;
}

const locationSeedPath = join(__dirname, '..', 'location-seed');

export const upsertMapLevel1 = async () => {
  const sidoList: Location[] = JSON.parse(
    fs.readFileSync(join(locationSeedPath, 'sido.json'), 'utf-8'),
  );

  for (const sido of sidoList) {
    console.log(`INSERT map 1: ${sido.bjd_cd}`);
    await prisma.mapLevel1.upsert({
      where: {
        code: sido.cd,
      },
      create: {
        code: sido.cd,
        name: sido.name,
        lat: Number(sido.lat),
        lng: Number(sido.lng),
      },
      update: {
        code: sido.cd,
        name: sido.name,
        lat: Number(sido.lat),
        lng: Number(sido.lng),
      },
    });
  }
};

export const upsertMapLevel2 = async () => {
  const sggList: Location[] = JSON.parse(
    fs.readFileSync(join(locationSeedPath, 'sgg.json'), 'utf-8'),
  );

  for (const sgg of sggList) {
    console.log(`INSERT map 2: ${sgg.bjd_cd}`);
    await prisma.mapLevel2.upsert({
      where: {
        code: sgg.cd,
      },
      create: {
        code: sgg.cd,
        name: sgg.name,
        lat: Number(sgg.lat),
        lng: Number(sgg.lng),
      },
      update: {
        code: sgg.cd,
        name: sgg.name,
        lat: Number(sgg.lat),
        lng: Number(sgg.lng),
      },
    });
  }
};

export const upsertMapLevel3 = async () => {
  const legList: Location[] = JSON.parse(
    fs.readFileSync(join(locationSeedPath, 'leg.json'), 'utf-8'),
  );

  for (const leg of legList) {
    console.log(`INSERT map 3: ${leg.bjd_cd}`);
    await prisma.mapLevel3.upsert({
      where: {
        code: leg.cd,
      },
      create: {
        code: leg.cd,
        name: leg.name,
        lat: Number(leg.lat),
        lng: Number(leg.lng),
      },
      update: {
        code: leg.cd,
        name: leg.name,
        lat: Number(leg.lat),
        lng: Number(leg.lng),
      },
    });
  }
};
