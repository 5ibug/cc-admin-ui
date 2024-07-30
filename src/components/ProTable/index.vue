<script setup lang="ts">
  import { onMounted, Ref, ref } from 'vue';
  // 获取register

  const emit = defineEmits<{
    register: [e: any];
  }>();
  const register = ref({});
  emit('register', register);
</script>

<template>
  <a-card>
    <a-row>
      <a-col flex="1">
        <a-form
          :model="register.formModel"
          :label-col-props="{ span: 6 }"
          :wrapper-col-props="{ span: 18 }"
          label-align="left"
        >
          <a-row :gutter="16">
            <a-col
              v-for="(item, index) in register?.searchParam"
              :key="index"
              :span="8"
            >
              <a-form-item :field="item.field" :label="item.name">
                <a-input
                  v-model="register.formModel[item.field]"
                  :placeholder="`请输入${item.name}`"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-col>
      <a-divider style="height: 84px" direction="vertical" />
      <a-col :flex="'86px'" style="text-align: right">
        <a-space direction="vertical" :size="18">
          <a-button type="primary" @click="register.search">
            <template #icon>
              <icon-search />
            </template>
            搜索
          </a-button>
          <a-button @click="register.reset">
            <template #icon>
              <icon-refresh />
            </template>
            重置
          </a-button>
        </a-space>
      </a-col>
    </a-row>
    <a-divider style="margin-top: 0" />
    <!-- 表格-->
    <a-table
      :columns="register.columns"
      :data="register.tableData"
      :pagination="register.pagination"
      @page-change="register.tablePageChange"
    >
      <template
        v-for="column in register.columns"
        #[column.slotName]="{ text, record, index }"
      >
        <slot
          v-if="column.slotName"
          :name="column.slotName"
          v-bind="{ text, record, index }"
        ></slot>
      </template>
    </a-table>
  </a-card>
</template>

<style scoped lang="less"></style>
