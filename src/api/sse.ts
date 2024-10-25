import { EventSourcePolyfill } from 'event-source-polyfill';
import { getToken } from '@/utils/auth';

export type MessageHandler = (event: MessageEvent) => void;
export type ErrorHandler = (error: Event) => void;

export class SSE {
  private static baseURL: string = import.meta.env.VITE_API_BASE_URL || '';

  private static getToken(): string {
    return getToken() || '';
  }

  static connect(
    endpoint: string,
    onMessage: MessageHandler,
    onError: ErrorHandler
  ): EventSourcePolyfill {
    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.getToken()}`,
    };

    const eventSource = new EventSourcePolyfill(url, { headers });

    // @ts-ignore
    eventSource.onmessage = (event: MessageEvent) => {
      if (onMessage) {
        onMessage(event);
      }
    };

    // @ts-ignore
    eventSource.onerror = (error: Event) => {
      if (onError) {
        onError(error);
      }
      // 在发生错误时关闭连接
      eventSource.close();
    };

    return eventSource;
  }
}
