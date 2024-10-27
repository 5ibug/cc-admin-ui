<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { Message, MessageContent, sendMessage } from '@/api/ai/chat';
  import ChatMessage from '@/views/ai/chat/components/chat-item/index.vue';

  function extractAndRemoveJson(str: string) {
    const regex = /<tool_call>(.*?)<\/tool_call>/s;
    const match = str.match(regex);
    console.log(str);
    if (match) {
      try {
        const jsonString = match[1];
        const jsonObject = JSON.parse(jsonString);

        // 如果解析成功，删除匹配的部分
        const newStr = str.replace(regex, '');

        return {
          jsonObject,
          newStr,
        };
      } catch (error) {
        console.error('中间内容不是有效的 JSON:', error);
      }
    } else {
      console.log('字符串不包含<tool_call>和</tool_call>之间的内容');
    }

    return null;
  }

  // 对话数据
  const list = ref([
    {
      type: 'system',
      message: '你好,有什么可以帮助您。',
      status: 'done',
    },
  ]);
  // 初始化
  const init = () => {};
  const text = ref('');
  const send = () => {
    // 把当前的消息插入进去, 然后获取新的
    list.value.push({
      type: 'user',
      message: text.value,
      status: 'done',
    });
    // 发送消息
    list.value.push({
      type: 'assistant',
      message: '',
      status: '',
    });
    // 获取要修改的数组的下标.
    const index = list.value.length - 1;
    // 处理要发送的消息
    const sendMessageList: Message[] = [];
    list.value.forEach((item) => {
      if (item.message !== '') {
        sendMessageList.push({
          role: item.type,
          content: {
            content: item.message,
            type: 'text',
          },
        } as Message);
      }
    });
    sendMessage(
      sendMessageList,
      (value) => {
        // 处理返回流
        const { result } = value;
        list.value[index].message += result.output.content;
      },
      () => {
        list.value[index].status = 'done';

        const result = extractAndRemoveJson(list.value[index].message);
        if (result?.jsonObject) {
          list.value[
            index
          ].message = `${result?.newStr}调用函数：${result?.jsonObject.name}`;

          if (result?.jsonObject.name === 'editUserNameFunction') {
            alert(
              `你确定要把名字改成${result?.jsonObject.arguments.newName}吗`
            );
          }
        }
      }
    );

    text.value = '';
  };

  onMounted(() => {
    init();
  });
</script>

<template>
  <div class="container">
    <Breadcrumb :items="['system.router.ai', 'system.router.ai.chat']" />
    <!--   左右两侧，左侧选择对话，右侧聊天内容区 数据存放在 IndexedDb-->
    <a-card title="AI Chat">
      <a-row style="margin-top: 20px" :gutter="24">
        <a-col flex="400px">
          <a-card title="选择对话">
            <div
              class="item"
              style="
                width: 300px;
                border: 2px solid rgb(22 92 255);
                padding: 10px;
                border-radius: 15px;
              "
            >
              <div class="title" style="font-size: 20px"> 新建对话 </div>
              <div class="sub-title" style="font-size: 12px; color: #a6a6a6">
                <a-row class="grid-demo">
                  <a-col :span="12"> 共10条对话 </a-col>
                  <a-col :span="12"> 2024/10/24 23:23:10 </a-col>
                </a-row>
              </div>
            </div>
          </a-card>
        </a-col>
        <a-col flex="auto" style="max-width: calc(100% - 400px - 24px)">
          <a-card>
            <div class="top">
              <div class="title" style="font-size: 24px; line-height: 4rem"
                >对话主题</div
              >
              <div class="sub-title">共有X条对话</div>
              <a-divider />
            </div>
            <div class="main" style="min-height: 500px">
              <ChatMessage
                v-for="(item, index) in list"
                :key="index"
                :message="item.message"
                :is-self="item.type == 'user'"
                :is-loading="item.status !== 'done'"
              />

              <!--              <ChatMessage-->
              <!--                avatar="https://cdn.v2ex.com/avatar/76ce/de13/416291_large.png?m=1715074590"-->
              <!--                message="I'm good, thank you!I'm good, thank you!I'm good, thank you!I'm good, thank you!I'm good, thank you!I'm good, thank you!I'm good, thank you!I'm good, thank you!I'm good, thank you!I'm good, thank you!I'm good, thank you!I'm good, thank you!I'm good, thank you!I'm good, thank you!I'm good, thank you!I'm good, thank you!"-->
              <!--                :is-self="false"-->
              <!--              />-->
            </div>
            <div class="sender">
              <a-divider />
              <div class="icons" style="padding-bottom: 10px">
                <a-space>
                  <a-button type="primary" shape="round" size="mini">
                    <icon-plus />
                  </a-button>
                  <a-button type="primary" shape="round" size="mini">
                    <icon-plus />
                  </a-button>
                  <a-button type="primary" shape="round" size="mini">
                    <icon-plus />
                  </a-button>
                  <a-button type="primary" shape="round" size="mini">
                    <icon-plus />
                  </a-button>
                </a-space>
              </div>
              <a-textarea
                v-model="text"
                placeholder="Enter 发送, Shift + Enter 换行, /触发补全, :触发命令"
                allow-clear
                :auto-size="{
                  minRows: 3,
                  maxRows: 8,
                }"
              />
            </div>
            <div style="text-align: right; margin-top: 10px">
              <a-button type="primary" @click="send">
                <template #icon>
                  <icon-send />
                </template>
                发送
              </a-button>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
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
