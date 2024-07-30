<script lang="tsx">
  import { compile, defineComponent, h } from 'vue';

  export default defineComponent({
    props: {
      icon: {
        type: String,
        default: '',
      },
    },
    setup(props) {
      return () => (props.icon ? h(compile(`<${props.icon}/>`)) : <></>);
    },
  });
</script>
