import { DirectiveBinding } from 'vue';
import { useUserStore } from '@/store';

function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
  const { value } = binding;
  const userStore = useUserStore();
  const { permissions } = userStore;

  if (Array.isArray(value)) {
    if (value.length > 0) {
      const permissionValues = value;
      // 如果 permissions 包含 '*:*:*'，那么不进行校验，hasPermission为true
      let hasPermission = permissions.includes('*:*:*');

      if (!hasPermission) {
        // 如果 permissions 不包含 '*:*:*'，那么检查 permissions 是否包含 permissionValues 中的任一元素
        hasPermission = permissionValues.some((permission: string) =>
          permissions.includes(permission)
        );
      }

      if (!hasPermission && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }
  } else {
    throw new Error(`权限错误"`);
  }
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
};
