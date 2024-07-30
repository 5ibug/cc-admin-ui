<script setup lang="ts">
  import { ref } from 'vue';
  import type {
    FileItem,
    RequestOption,
  } from '@arco-design/web-vue/es/upload/interfaces';

  import { useUserStore } from '@/store';
  import { DescData, Message } from '@arco-design/web-vue';
  import { setAvatar, updatePassword, updateUserInfo } from '@/api/user';

  const userStore = useUserStore();

  const file = {
    uid: '-2',
    name: 'avatar.png',
    url: `${import.meta.env.VITE_DFS_PREFIX}${userStore.user?.avatar}`,
  };

  const fileList = ref<FileItem[]>([file]);
  const uploadChange = (fileItemList: FileItem[], fileItem: FileItem) => {
    fileList.value = [fileItem];
  };

  const renderData = [
    {
      label: '用户名称',
      value: userStore.user?.nickName,
    },
    {
      label: '手机号码',
      value: userStore.user?.phonenumber,
    },
    {
      label: '用户邮箱',
      value: userStore.user?.email,
    },
    {
      label: '所属角色',
      value: userStore?.roles.join(','),
    },
    {
      label: '登录时间',
      value: new Date(userStore.user?.loginDate as string).toLocaleString(
        'zh-CN',
        {
          timeZone: 'Asia/Shanghai',
        }
      ),
    },
  ] as DescData[];

  // 上传头像
  const customRequest = (options: RequestOption) => {
    const controller = new AbortController();
    //
    (async function requestWrap() {
      const {
        onProgress,
        onError,
        onSuccess,
        fileItem,
        name = 'avatarFile',
      } = options;
      onProgress(20);
      const formData = new FormData();
      formData.append(name as string, fileItem.file as Blob);

      // const onUploadProgress = (event: ProgressEvent) => {
      //   let percent;
      //   if (event.total > 0) {
      //     percent = (event.loaded / event.total) * 100;
      //   }
      //   onProgress(parseInt(String(percent), 10), event);
      // };
      try {
        // console.log(onUploadProgress)

        setAvatar(formData, {
          controller,
          // onUploadProgress,
        })
          .then((res) => {
            onSuccess(res);
          })
          .catch((err) => {
            console.log(err);

            onError(err);
          });
      } catch (error) {
        onError(error);
      }
    })();
    return {
      abort() {
        controller.abort();
      },
    };
  };

  // 下面的两个表单
  // 基本信息
  const basicForm = ref({
    nickName: userStore.user?.nickName,
    phonenumber: userStore.user?.phonenumber,
    sex: userStore.user?.sex,
    email: userStore.user?.email,
    username: userStore.user?.username,
  });
  // 修改密码
  const passwordForm = ref({
    oldPassword: null,
    newPassword: null,
    confirmPassword: null,
  });
  const resetBasic = () => {
    basicForm.value = {
      nickName: userStore.user?.nickName,
      phonenumber: userStore.user?.phonenumber,
      sex: userStore.user?.sex,
      email: userStore.user?.email,
      username: userStore.user?.username,
    };
  };
  const resetPassword = () => {
    passwordForm.value = {
      oldPassword: null,
      newPassword: null,
      confirmPassword: null,
    };
  };
  const saveBasic = async () => {
    const { msg } = await updateUserInfo(basicForm.value);
    Message.success(msg);
  };

  const savePassword = async () => {
    const { msg } = await updatePassword(passwordForm.value);
    Message.success(msg);
  };
</script>

<template>
  <div class="container">
    <Breadcrumb :items="['menu.user', 'menu.user.setting']" />
    <a-row style="margin-bottom: 16px">
      <a-col :span="24">
        <a-card :bordered="false">
          <a-space :size="54">
            <a-upload
              :custom-request="customRequest"
              list-type="picture-card"
              :file-list="fileList"
              :show-upload-button="true"
              :show-file-list="false"
              @change="uploadChange"
            >
              <template #upload-button>
                <a-avatar :size="100" class="info-avatar">
                  <template #trigger-icon>
                    <icon-camera />
                  </template>
                  <img v-if="fileList.length" :src="`${fileList[0].url}`" />
                </a-avatar>
              </template>
            </a-upload>
            <a-descriptions
              :data="renderData"
              :column="2"
              align="right"
              layout="inline-horizontal"
              :label-style="{
                width: '140px',
                fontWeight: 'normal',
                color: 'rgb(var(--gray-8))',
              }"
              :value-style="{
                width: '200px',
                paddingLeft: '8px',
                textAlign: 'left',
              }"
            >
              <template #label="{ label }"> {{ label }} :</template>
              <template #value="{ value }">
                <span>{{ value }}</span>
              </template>
            </a-descriptions>
          </a-space>
        </a-card>
      </a-col>
    </a-row>

    <a-row class="wrapper">
      <a-col :span="24">
        <a-tabs default-active-key="1" type="rounded">
          <a-tab-pane key="1" title="基本信息">
            <a-card :bordered="false">
              <a-form :model="basicForm" layout="vertical">
                <a-form-item
                  label="用户昵称"
                  field="nickName"
                  :rules="[{ required: true, message: '请输入用户昵称' }]"
                >
                  <a-input v-model="basicForm.nickName" />
                </a-form-item>
                <a-form-item
                  label="手机号码"
                  field="phonenumber"
                  :rules="[
                    {
                      length: 11,
                      required: true,
                      message: '请输入正确的手机号码',
                    },
                  ]"
                >
                  <a-input v-model="basicForm.phonenumber" />
                </a-form-item>
                <a-form-item
                  label="邮箱"
                  field="email"
                  :rules="[
                    {
                      type: 'email',
                      required: true,
                      message: '请输入正确的邮箱',
                    },
                  ]"
                >
                  <a-input v-model="basicForm.email" />
                </a-form-item>
                <a-form-item
                  label="性别"
                  field="sex"
                  :rules="[{ required: true, message: '请选择性别' }]"
                >
                  <a-radio-group v-model="basicForm.sex">
                    <a-radio value="0">男</a-radio>
                    <a-radio value="1">女</a-radio>
                    <a-radio value="2">未知</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item>
                  <a-space>
                    <a-button type="primary" @click="saveBasic">
                      保存
                    </a-button>
                    <a-button type="secondary" @click="resetBasic">
                      重置
                    </a-button>
                  </a-space>
                </a-form-item>
              </a-form>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="2" title="修改密码">
            <a-card :bordered="false">
              <a-form :model="passwordForm" layout="vertical">
                <a-form-item
                  label="原密码"
                  field="oldPassword"
                  :rules="[{ required: true, message: '请输入原密码' }]"
                >
                  <a-input v-model="passwordForm.oldPassword" />
                </a-form-item>
                <a-form-item
                  label="新密码"
                  field="newPassword"
                  :rules="[
                    { required: true, message: '请输入新密码' },
                    { minLength: 6, message: '密码长度不能小于6位' },
                  ]"
                >
                  <a-input v-model="passwordForm.newPassword" />
                </a-form-item>
                <a-form-item
                  label="确认密码"
                  field="confirmPassword"
                  :rules="[
                    {
                      required: true,
                      message: '请输入确认密码',
                    },
                    {
                      validator: (value, cb) => {
                        if (value !== passwordForm.newPassword) {
                          cb('两次输入的密码不一致');
                        } else {
                          cb();
                        }
                      },
                    },
                  ]"
                >
                  <a-input v-model="passwordForm.confirmPassword" />
                </a-form-item>
                <a-form-item>
                  <a-space>
                    <a-button type="primary" @click="savePassword">
                      保存
                    </a-button>
                    <a-button type="secondary" @click="resetPassword">
                      重置
                    </a-button>
                  </a-space>
                </a-form-item>
              </a-form>
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px;
  }

  .wrapper {
    min-height: 580px;
    padding: 20px 0 0 20px;
    background-color: var(--color-bg-2);
    border-radius: 4px;
  }

  :deep(.section-title) {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 14px;
  }

  .arco-card {
    padding: 14px 0 4px 4px;
    border-radius: 4px;
  }

  :deep(.arco-avatar-trigger-icon-button) {
    width: 32px;
    height: 32px;
    line-height: 32px;
    background-color: #e8f3ff;

    .arco-icon-camera {
      margin-top: 8px;
      color: rgb(var(--arcoblue-6));
      font-size: 14px;
    }
  }
</style>
