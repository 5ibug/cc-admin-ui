<template>
  <div :class="['chat-message', { 'is-self': isSelf }]">
    <!--    <img :src="avatar" alt="avatar" class="avatar" />-->
    <img :src="avatar" alt="avatar" class="avatar" />
    <div class="message-content">
      {{ message }}
      <span v-if="isLoading" class="loading">Loading...</span>
    </div>
  </div>
</template>

<script setup>
  import { useUserStore } from '@/store';
  import defaultAvatar from '@/assets/cc.png';
  import { computed, toRefs } from 'vue';

  const props = defineProps({
    message: {
      type: String,
      required: true,
    },
    isSelf: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  });

  const { message, isSelf, isLoading } = toRefs(props);

  const userStore = useUserStore();

  const avatar = computed(() => {
    return isSelf.value
      ? import.meta.env.VITE_DFS_PREFIX + userStore.user.avatar
      : defaultAvatar;
  });
</script>

<style scoped>
  .chat-message {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .chat-message.is-self {
    flex-direction: row-reverse;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 0 10px;
  }

  .message-content {
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 5px;
    max-width: 60%;
  }

  .is-self .message-content {
    background-color: #d1e7dd;
  }

  .loading {
    color: #999;
    font-style: italic;
  }
</style>
