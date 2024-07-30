type MenuType = 'C' | 'M' | 'F';

interface IconMeta {
  title: string;
  icon: string;
}

export interface Router {
  name: string;
  path: string;
  hidden: boolean;
  component: string;
  icon: string;
  menuType: MenuType;
  redirect?: string;
  alwaysShow?: boolean;
  meta: IconMeta;
  routes?: Router[];
}
