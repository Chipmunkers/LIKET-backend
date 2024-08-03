import {
  upsertMapLevel1,
  upsertMapLevel2,
  upsertMapLevel3,
} from './seed/location';
import { upsertAge, upsertGenre, upsertStyle } from './seed/tag';

async function main() {
  // Map data
  await Promise.all([upsertMapLevel1(), upsertMapLevel2(), upsertMapLevel3()]);

  // Tag data
  await Promise.all([upsertStyle(), upsertAge(), upsertGenre()]);
}
main();
