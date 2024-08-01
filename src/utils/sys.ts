import { getMenuTreeList, getMenuTreeListById } from '@/api/system/menu';
import { roleMenuTreeSelect, SysTreeMenu } from '@/types/SysMenu';
import { Composer } from 'vue-i18n';

// 递归添加子菜单, 但是要把title加个t处理i18n
const addTitle = (list: SysTreeMenu[], t: Composer['t']) => {
  list.forEach((item) => {
    item.title = t(item.title);
    if (item.children) {
      addTitle(item.children, t);
    }
  });
};

const getSystemMenuTree = async (t: Composer['t']): Promise<SysTreeMenu[]> => {
  const treeSelectData: SysTreeMenu[] = [];
  // 获取动态下拉上级菜单
  const { data } = await getMenuTreeList();
  if (data && data.length > 0) {
    // 最外层加个主菜单
    treeSelectData.push({ key: 0, title: '主目录', children: [] });
    addTitle(data, t);
    treeSelectData[0].children = data;
    return treeSelectData;
  }
  return [];
};

const getRoleSystemMenuTreeKeys = async (roleId: number): Promise<number[]> => {
  const data: { data: roleMenuTreeSelect } = await getMenuTreeListById(roleId);
  const checkMenus = data.data?.checkedMenus || [];
  const keys: number[] = [];
  checkMenus.forEach((item) => {
    keys.push(item.menuId);
  });
  console.log('获取用户默认菜单树', data, keys);
  return keys;
};
export { getSystemMenuTree, getRoleSystemMenuTreeKeys };
