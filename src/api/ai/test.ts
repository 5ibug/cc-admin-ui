import axios from 'axios';
import { ErrorHandler, MessageHandler, SSE } from '@/api/sse';

// 测试图片识别接口

// eslint-disable-next-line import/prefer-default-export
export function mutil({
  onMessage,
  onError,
}: {
  onMessage: MessageHandler;
  onError: ErrorHandler;
}) {
  return SSE.connect('/ai/test/ai/mutil', onMessage, onError);
}
