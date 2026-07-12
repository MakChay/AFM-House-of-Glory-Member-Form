import { db } from './firebase';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';

const SEED_DATA = [
  { name: "Mount Horeb", leaders: ["Bab' Mkhulisi", "Mam' Mkhulisi", "Mam' Jabu", "Bab' Makuwara"], contactNumbers: ["078 211 3644", "061 525 2645"], isActive: true },
  { name: "Mount Sinai", leaders: ["Mam' Jabu Ngubane"], contactNumbers: ["082 681 4745"], isActive: true },
  { name: "Living Word", leaders: ["Mam'", "Bab' Cube"], contactNumbers: [], isActive: true },
  { name: "Upper Room", leaders: ["Mam' Nkomo"], contactNumbers: ["072 211 4742"], isActive: true },
  { name: "His Glory", leaders: ["Mrs Molefe", "Mr & Mrs Hadebe"], contactNumbers: ["082 793 2630"], isActive: true },
  { name: "Potter's House", leaders: ["Mrs Banda"], contactNumbers: ["073 325 9305"], isActive: true },
  { name: "Ngabayethu", leaders: ["Mrs Mthembu", "Mr & Mrs Dhlamini", "Mrs Mnyani"], contactNumbers: ["072 872 8131", "076 028 5691", "072 173 4002"], isActive: true },
  { name: "House of Prayer", leaders: ["Mrs Langa", "Mrs Myeza"], contactNumbers: ["081 795 9386"], isActive: true },
  { name: "Praise", leaders: ["Bab' Basi"], contactNumbers: ["082 497 4412"], isActive: true },
];

export async function seedHomeCells() {
  const existing = await getDocs(collection(db, 'homeCells'));
  if (existing.size > 0) {
    return { seeded: false, count: existing.size, message: 'Home cells already exist' };
  }
  for (const cell of SEED_DATA) {
    await addDoc(collection(db, 'homeCells'), {
      ...cell,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  return { seeded: true, count: SEED_DATA.length, message: 'Home cells seeded successfully' };
}
