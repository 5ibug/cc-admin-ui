<script setup lang="ts">
  import { ref, h } from 'vue';
  import {
    editStatusParams,
    JobListData,
    JobListParams,
    runJobParams,
  } from '@/types/JobCornType';
  import {
    getCronPage,
    editStatus,
    runCronJob,
    getJobDetails,
    deleteJobs,
    addCron,
    putCron,
  } from '@/api/system/job';
  import { Message, TableRowSelection, Modal } from '@arco-design/web-vue';
  import details from '@/views/monitor/job/components/details';
  import { getDictDataType } from '@/api/system/dist';
  import { SysDictData } from '@/types/SysDict';

  const formModel = ref({
    jobName: null,
    jobGroup: null,
    status: null,
  } as JobListParams);

  const isSearch = ref(false);

  const selectedKeys = ref([] as number[]); // 选中的key 用于批量删除
  const columns = [
    {
      title: '任务名称',
      dataIndex: 'jobName',
    },
    {
      title: '任务组名',
      dataIndex: 'jobGroup',
    },
    {
      title: '调用目标字符串',
      dataIndex: 'invokeTarget',
    },
    {
      title: 'cron执行表达式',
      dataIndex: 'cronExpression',
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      slotName: 'status',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      dataIndex: 'action',
      slotName: 'action',
    },
  ];

  const jobListData = ref([] as JobListData[]);
  const search = () => {
    isSearch.value = true;
    fetchDate();
  };

  // 分页组件
  const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 表格选择
  const rowSelection = ref({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as TableRowSelection);

  const reset = () => {
    isSearch.value = false;
    formModel.value = {
      jobName: null,
      jobGroup: null,
      status: null,
    };
    fetchDate();
  };

  // 编辑状态
  const switchStatus = async (
    record: JobListData,
    newValue: string | number | boolean
  ) => {
    const { msg } = await editStatus({
      jobId: record.jobId,
      status: newValue,
    } as editStatusParams);
    Message.success(msg);
  };

  // 添加和删除分组列表
  const jobGroupList = ref([] as SysDictData[]);
  // modal是否显示
  const modalVisible = ref(false);
  // modal状态, 是删除还是编辑
  const isEdit = ref(false);
  // modal的form数据
  const modalForm = ref({
    jobId: 0,
    jobName: '',
    jobGroup: 'DEFAULT',
    invokeTarget: '',
    cronExpression: '',
    misfirePolicy: '3',
    concurrent: '0',
    status: '0',
    remark: '',
  } as JobListData);
  // 创建
  const create = () => {
    isEdit.value = false;
    modalVisible.value = true;
    getDictDataType('sys_job_group').then((res) => {
      jobGroupList.value = res.data;
    });
    // 清空modalForm
    modalForm.value = {
      jobId: 0,
      jobName: '',
      jobGroup: 'DEFAULT',
      invokeTarget: '',
      cronExpression: '',
      misfirePolicy: '3',
      concurrent: '0',
      status: '0',
      remark: '',
    } as JobListData;
  };
  // 编辑
  const editJob = (job: JobListData) => {
    isEdit.value = true;
    modalVisible.value = true;
    modalForm.value = job;
    getDictDataType('sys_job_group').then((res) => {
      jobGroupList.value = res.data;
    });
  };
  // 批量删除
  const batchDelete = async () => {
    const { msg } = await deleteJobs(selectedKeys.value);
    Message.success(msg);
    selectedKeys.value = [];
    fetchDate();
  };
  // 删除一个
  const deleteJob = async (jobId: number) => {
    const { msg } = await deleteJobs(jobId);
    Message.success(msg);
    // 如果选中的key中有这个key, 就删除
    if (selectedKeys.value.includes(jobId)) {
      selectedKeys.value = selectedKeys.value.filter((item) => item !== jobId);
    }
    fetchDate();
  };

  // 运行
  const runJob = async (job: JobListData) => {
    const { msg } = await runCronJob({
      jobId: job.jobId,
      jobGroup: job.jobGroup,
    } as runJobParams);
    Message.success(msg);
  };

  // modal提交
  const modalOk = async () => {
    modalVisible.value = false;
    // 判断是编辑还是新增
    const { msg } = isEdit.value
      ? await putCron(modalForm.value)
      : await addCron(modalForm.value);
    Message.success(msg);
    fetchDate();
  };

  const jobDetails = async (jobId: number) => {
    const { data } = await getJobDetails(jobId);
    Modal.info({
      title: '任务详情',
      content: () => h(details(data)),
      width: 700,
    });
  };

  const fetchDate = () => {
    // 防止切换页码时携带搜索
    const params = isSearch.value
      ? {
          ...formModel.value,
          current: pagination.value.current,
          pageSize: pagination.value.pageSize,
        }
      : ({
          current: pagination.value.current,
          pageSize: pagination.value.pageSize,
        } as JobListParams);
    getCronPage(params).then((res) => {
      const { data } = res;
      jobListData.value = data.records;
      pagination.value.total = data.total;
    });
  };
  fetchDate();
</script>

<script lang="ts">
  export default {
    name: 'Job',
  };
</script>

<template>
  <div class="container">
    <Breadcrumb :items="['system.monitor', 'monitor.job']" />
    <a-card class="general-card" :title="$t('monitor.job')">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="jobName" label="任务名称">
                  <a-input
                    v-model="formModel.jobName as any"
                    placeholder="请输入任务名称"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item field="jobGroup" label="任务组名">
                  <a-input
                    v-model="formModel.jobGroup as any"
                    placeholder="请输入任务组名"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item field="status" label="状态">
                  <a-select
                    v-model="formModel.status as any"
                    placeholder="请选择状态"
                  >
                    <a-option value="0"> 启用 </a-option>
                    <a-option value="1"> 禁用 </a-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              搜索
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />

      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="create">
              <template #icon>
                <icon-plus />
              </template>
              新建
            </a-button>

            <a-button
              type="primary"
              status="danger"
              :disabled="selectedKeys.length <= 0"
              @click="batchDelete"
            >
              <template #icon>
                <icon-plus />
              </template>
              批量删除
            </a-button>
          </a-space>
        </a-col>
      </a-row>

      <a-row>
        <a-col :flex="1">
          <a-table
            v-model:selectedKeys="selectedKeys"
            :columns="columns"
            :data="jobListData"
            :pagination="pagination"
            :row-selection="rowSelection"
            row-key="jobId"
          >
            <template #status="{ record }">
              <a-switch
                v-model="record.status"
                checked-value="0"
                unchecked-value="1"
                @change="(newValue:string | number | boolean) => switchStatus(record, newValue)"
              />
            </template>

            <template #action="{ record }">
              <!-- 修改 执行 详情 删除-->
              <a-space wrap size="mini" class="tableAction">
                <template #split>
                  <a-divider direction="vertical" margin="0" />
                </template>
                <a-button
                  type="text"
                  size="mini"
                  @click="() => editJob(record)"
                >
                  <template #icon>
                    <icon-edit />
                  </template>
                  <template #default> 修改</template>
                </a-button>

                <a-popconfirm
                  :content="'是否执行任务'"
                  type="warning"
                  @ok="() => runJob(record)"
                >
                  <a-button type="text" size="mini">
                    <template #icon>
                      <icon-play-arrow-fill />
                    </template>
                    <template #default> 执行</template>
                  </a-button>
                </a-popconfirm>

                <a-button
                  type="text"
                  size="mini"
                  @click="() => jobDetails(record.jobId)"
                >
                  <template #icon>
                    <icon-eye />
                  </template>
                  <template #default> 详情</template>
                </a-button>

                <a-popconfirm
                  :content="'是否删除任务'"
                  type="warning"
                  @ok="() => deleteJob(record.jobId)"
                >
                  <a-button type="text" size="mini">
                    <template #icon>
                      <icon-delete />
                    </template>
                    <template #default> 删除</template>
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </a-table>
        </a-col>
      </a-row>
    </a-card>

    <!--添加和删除的modal-->
    <a-modal
      v-model:visible="modalVisible"
      :title="isEdit ? '编辑任务' : '新增任务'"
      :ok-text="isEdit ? '修改' : '新增'"
      width="800px"
      @ok="modalOk"
    >
      <a-form
        :model="modalForm"
        :label-col-props="{ span: 6 }"
        :wrapper-col-props="{ span: 18 }"
        label-align="right"
      >
        <a-row>
          <a-col :span="12">
            <a-form-item field="jobName" label="任务名称">
              <a-input v-model="modalForm.jobName" placeholder="任务名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="jobGroup" label="任务组名">
              <a-select v-model="modalForm.jobGroup" placeholder="请选择">
                <a-option
                  v-for="item in jobGroupList"
                  :key="item.dictValue"
                  :value="item.dictValue"
                >
                  {{ item.dictLabel }}
                </a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              field="invokeTarget"
              :label-col-props="{ span: 3 }"
              :wrapper-col-props="{ span: 21 }"
            >
              <template #label>
                <a-popover title="提示">
                  <span>调用方法</span>
                  <template #content>
                    <p>Bean调用示例： </p>
                    <p>twtTask.twtParams('twt')</p>
                    <p>Class类调用示例： </p>
                    <p>com.twelvet.server.job.task.TWTTask.twtParams('twt') </p>
                    <p>参数说明：支持字符串，布尔类型，长整型，浮点型，整型</p>
                  </template>
                </a-popover>
              </template>
              <a-input
                v-model="modalForm.invokeTarget"
                placeholder="调用方法"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="cronExpression" label="cron表达式">
              <a-input
                v-model="modalForm.cronExpression"
                placeholder="cron表达式"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="misfirePolicy" label="错误策略">
              <a-select v-model="modalForm.misfirePolicy">
                <a-option value="0">默认</a-option>
                <a-option value="1">立即执行</a-option>
                <a-option value="2">执行一次</a-option>
                <a-option value="3">放弃执行</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="concurrent" label="并发策略">
              <a-radio-group v-model="modalForm.concurrent">
                <a-radio value="0">允许</a-radio>
                <a-radio value="1">禁止</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="status" label="状态">
              <a-radio-group v-model="modalForm.status">
                <a-radio value="0">正常</a-radio>
                <a-radio value="1">暂停</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px;

    .tableAction {
      button {
        padding: 0;
      }
    }
  }
</style>
