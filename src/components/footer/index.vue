<template>
  <a-layout-footer class="footer"
    >CC Admin &copy;Copyright 王振
    {{ new Date().getFullYear() }}</a-layout-footer
  >
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    color: var(--color-text-2);
    text-align: center;
  }
</style>
