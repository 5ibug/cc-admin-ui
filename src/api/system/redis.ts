import axios from 'axios';
import { RedisData } from '@/types/RedisInfoType';

export default function getRedisInfo() {
  return axios.get<RedisData>('/system/monitor/redis');
}
