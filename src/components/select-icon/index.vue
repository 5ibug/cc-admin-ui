<script lang="tsx">
  import { compile, defineComponent, h } from 'vue';
  import { useI18n } from 'vue-i18n';
  import iconList from './icon-list';

  export default defineComponent({
    props: {
      modelValue: {
        type: String,
        default: '',
      },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const { t } = useI18n();
      const editIcon = (icon: string) => {
        // 修改父组件的值
        emit('update:modelValue', icon);
      };
      const tabPanes = () => {
        return iconList.map((item) => {
          return (
            <a-tab-pane key={item.title} title={t(item.title)}>
              <a-row>
                {item.list.map((icon) => {
                  return (
                    <a-col span={3} onClick={() => editIcon(icon)}>
                      {h(compile(`<${icon}/>`))}
                    </a-col>
                  );
                })}
              </a-row>
            </a-tab-pane>
          );
        });
      };

      return () => <a-tabs lazy-load>{tabPanes()}</a-tabs>;
    },
  });
</script>

<style scoped>
  .arco-icon {
    font-size: 24px;
    text-align: center;
    cursor: pointer;
  }
</style>
