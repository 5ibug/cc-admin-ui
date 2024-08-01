<script setup lang="ts">
  import { ref } from 'vue';
  import { TableColumnData } from '@arco-design/web-vue';
  // 获取register

  const emit = defineEmits<{
    register: [e: any];
  }>();
  const register = ref<{ [key: string]: any }>({});
  emit('register', register);
  // 拟态窗显示状态
  const visible = ref<boolean>(false);

  // 添加和编辑的表单数据
  const modelForm = ref<{ [key: string]: any }>({});
  const isEditModel = ref<boolean>(false);

  // 显示拟态窗
  const showModel = (record: { [key: string]: any } = {}) => {
    isEditModel.value = Object.keys(record).length === 0;
    modelForm.value = record;
    visible.value = true;
  };
  // 隐藏拟态窗
  const cancelModel = () => {
    visible.value = false;
  };
  // 添加/编辑接口  register.config.edit(record)
  const modelOk = async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
    console.log(modelForm.value);
    return true;
  };
  // 删除
  const remove = (record: any) => {
    register.value.config.remove(record);
  };
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
    <a-space direction="vertical" :size="18" style="margin-bottom: 5px">
      <a-button
        v-if="register?.config.addButton"
        type="primary"
        @click="showModel()"
        >添加</a-button
      >
    </a-space>
    <a-table
      :columns="register.columns.filter((column: any) => !column.hidden)"
      :data="register.tableData"
      :pagination="register.pagination"
      @page-change="register.tablePageChange"
    >
      <template
        v-for="column in register.columns.filter((column: any) => !column.hidden)"
        :key="column.slotName"
        #[column.slotName]="{ text, record, index }"
      >
        <slot
          v-if="column.slotName"
          :name="column.slotName"
          v-bind="{ text, record, index }"
        >
        </slot>
        <a-space>
          <a-button
            v-if="column.slotName == 'action' && register.config.editButton"
            @click="showModel(record)"
            >编辑</a-button
          >
          <a-popconfirm
            v-if="column.slotName == 'action' && register.config.deleteButton"
            content="是否确认删除?"
            ok-text="删除"
            type="warning"
            @ok="remove(record)"
          >
            <a-button status="danger">删除</a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>
  </a-card>
  <a-modal
    v-model:visible="visible"
    :on-before-ok="modelOk"
    unmount-on-close
    @cancel="cancelModel"
  >
    <template #title> {{ isEditModel ? '新增' : '编辑' }} </template>
    <a-form
      :model="modelForm"
      :label-col-props="{ span: 6 }"
      :wrapper-col-props="{ span: 18 }"
      label-align="left"
    >
      <a-form-item
        v-for="(item,index) in register.columns.filter((column: any) => column.dataIndex)"
        :key="index"
        :field="item.dataIndex"
        :label="item.title"
      >
        <a-input
          v-if="item.type == undefined"
          v-model="modelForm[item.dataIndex]"
        />
        {{ item.type }}
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped lang="less"></style>
