export type PluginRuntimeConfig = {
  enabled: boolean;
  config?: Record<string, unknown>;
};

export declare const definePluginConfig: <T extends Record<string, PluginRuntimeConfig>>(config: T) => T;
