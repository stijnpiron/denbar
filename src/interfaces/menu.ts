export interface MenuItem {
  action?: (...args: any) => any;
  alwaysEnabled?: boolean;
  disabled?: boolean;
  hide?: boolean;
  icon: string;
  key: string;
  route?: string;
  text: string;
}

export interface MenuParts {
  [index: number]: MenuItem[];
}
