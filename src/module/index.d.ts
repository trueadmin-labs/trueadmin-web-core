export type FrontendRoute = {
  path: string;
  component?: unknown;
  meta?: Record<string, unknown>;
};

export type FrontendMenu = {
  code: string;
  title?: string;
  i18n?: string;
  path?: string;
  icon?: unknown;
  type?: 'directory' | 'menu' | 'button' | 'link';
  status?: 'enabled' | 'disabled';
  sort?: number;
  children?: FrontendMenu[];
  [key: string]: unknown;
};

export type ModuleManifest = {
  id: string;
  routes?: FrontendRoute[];
  menus?: FrontendMenu[];
  locales?: Record<string, unknown>;
  icons?: Record<string, unknown>;
  errors?: Record<string, unknown>;
  notification?: Record<string, unknown>;
  profile?: Record<string, unknown>;
};

export declare const defineModule: <T extends ModuleManifest>(manifest: T) => T;
