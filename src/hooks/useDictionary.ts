import { ref, onMounted, Ref } from 'vue';
import { getDictionary } from '@/utils/dict';
import { SysDictData } from '@/types/SysDict';

// eslint-disable-next-line import/prefer-default-export
export function useDictionary(dictType: string) {
  const dictionary: Ref<SysDictData[]> = ref([]);
  const isLoading = ref(true);

  const getDictLabelByValue = (value: string): string | null => {
    const dictItem = dictionary.value.find((item) => item.dictValue === value);
    return dictItem ? dictItem.dictLabel : null;
  };

  onMounted(async () => {
    try {
      dictionary.value = await getDictionary(dictType);
    } catch (error) {
      console.error('Failed to fetch dictionary data:', error);
    } finally {
      isLoading.value = false;
    }
  });

  return {
    dictionary,
    isLoading,
    getDictLabelByValue,
  };
}
