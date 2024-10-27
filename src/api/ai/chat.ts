import { getToken } from '@/utils/auth';

// 对话接口

export interface MessageContent {
  file?: string;
  content: string;
  type: string;
}

export interface Message {
  role: string;
  content: MessageContent;
}
// eslint-disable-next-line import/prefer-default-export
export const sendMessage = async (
  message: Message[],
  handleMessage: (data: any) => void,
  handleDone: () => void
): Promise<void> => {
  try {
    const response = await fetch('/api/ai/test/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    if (!response.body) {
      throw new Error('ReadableStream not supported');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    const processText = async ({
      done,
      value,
    }: ReadableStreamReadResult<Uint8Array>): Promise<void> => {
      if (done) {
        handleDone();
        return;
      }

      const text = decoder.decode(value, { stream: true });
      if (text.startsWith('data:')) {
        const jsonText = text.slice(5).trim();
        console.log(jsonText);
        if (jsonText) {
          handleMessage(JSON.parse(jsonText));
          console.log('done');
        }
      }

      await reader.read().then(processText);
    };

    await reader.read().then(processText);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
};
