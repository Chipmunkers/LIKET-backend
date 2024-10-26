import {
  upsertMapLevel1,
  upsertMapLevel2,
  upsertMapLevel3,
} from './seed/location';
import { upsertAge, upsertGenre, upsertStyle } from './seed/tag';

async function main() {
  // Map data
  await upsertMapLevel1();
  await upsertMapLevel2();
  await upsertMapLevel3();

  // Tag data
  //await Promise.all([upsertStyle(), upsertAge(), upsertGenre()]);
}
main();
