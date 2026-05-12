export type TransText = {
  readonly __trans: true;
  readonly key: string;
  readonly fallback?: string;
};

export type TranslateFunction = (key?: string, fallback?: string) => string;

export declare const trans: (key: string, fallback?: string) => TransText;

export declare const isTransText: (value: unknown) => value is TransText;

export declare const resolveTrans: (
  value: string | TransText | undefined,
  translate: TranslateFunction,
  fallback?: string,
) => string;

export type RenderableTrans<TContext, TRender = unknown> =
  | string
  | TransText
  | ((context: TContext) => TRender);

export declare const resolveRenderableTrans: <TContext, TRender = unknown>(
  value: RenderableTrans<TContext, TRender> | undefined,
  context: TContext,
  translate: TranslateFunction,
  fallback?: string,
) => string | TRender;
