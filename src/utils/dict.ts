import { openDB } from 'idb';
import { CachedDictionary, SysDictData } from '@/types/SysDict';
import { getDictDataType } from '@/api/system/dist';
import { AxiosResponse } from 'axios';

// 打开或创建一个 IndexedDB 数据库
const dbPromise = openDB('dictionaryDB', 1, {
  upgrade(db) {
    db.createObjectStore('dictionary', { keyPath: 'dictType' });
  },
});

// 从接口获取字典数据
async function fetchDictionaryFromAPI(
  dictType: string
): Promise<AxiosResponse<SysDictData[]>> {
  return getDictDataType(dictType);
}

// 将字典数据缓存到 IndexedDB
async function cacheDictionaryData(
  dictType: string,
  data: SysDictData[]
): Promise<void> {
  const db = await dbPromise;
  const timestamp = Date.now();
  await db.put('dictionary', { dictType, data, timestamp });
}

// 从 IndexedDB 获取缓存的字典数据
async function getCachedDictionaryData(
  dictType: string
): Promise<CachedDictionary | undefined> {
  const db = await dbPromise;
  return db.get('dictionary', dictType);
}

// 获取字典数据
async function getDictionary(dictType: string): Promise<SysDictData[]> {
  const cachedData = await getCachedDictionaryData(dictType);

  // 检查缓存的数据是否在10分钟以内
  if (cachedData && Date.now() - cachedData.timestamp < 10 * 60 * 1000) {
    return cachedData.data;
  }

  // 调用API获取数据
  const data = await fetchDictionaryFromAPI(dictType);
  await cacheDictionaryData(dictType, data.data);

  return data.data;
}

// eslint-disable-next-line import/prefer-default-export
export { getDictionary };
