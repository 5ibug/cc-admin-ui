// 用法
// <dict type='xxx' value='字典值' />
// <dict type='xxx'>字典值</dict>
import { defineComponent, ref, onMounted, watch } from 'vue';
import { useDictionary } from '@/hooks/useDictionary';

interface Props {
  type: string;
  value?: string;
}

const DictComponent = defineComponent({
  props: {
    type: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: false,
    },
  },
  setup(props: Props, { slots }) {
    const { dictionary, isLoading, getDictLabelByValue } = useDictionary(
      props.type
    );

    const dictValue = ref<string | null>(null);

    const setDictValue = () => {
      if (props.value) {
        dictValue.value = getDictLabelByValue(props.value);
      } else if (slots.default) {
        const slotContent = (slots.default()[0]?.children as string) || '';
        dictValue.value = getDictLabelByValue(slotContent);
      }
    };

    onMounted(() => {
      setDictValue();
    });

    watch(dictionary, () => {
      setDictValue();
    });

    return () => {
      if (isLoading.value) {
        return <div>Loading...</div>;
      }

      return <>{dictValue.value}</>;
    };
  },
});

export default DictComponent;
