import type { ReactNode } from 'react';
import type { RenderableTrans, TranslateFunction } from '../i18n/index.js';

export declare class ApiError extends Error {
  readonly code: string;
  readonly status?: number;
  readonly details?: unknown;
  constructor(code: string, message: string, status?: number, details?: unknown);
}

export type ErrorSeverity = 'info' | 'warning' | 'error';

export type ErrorRenderContext = {
  error: ApiError;
  t: TranslateFunction;
  reason?: string;
  traceId?: string;
};

export type ErrorRenderable = RenderableTrans<ErrorRenderContext>;

export type ErrorExplanation = {
  title?: ErrorRenderable;
  description?: ErrorRenderable;
  causes?: ErrorRenderable[];
  suggestions?: ErrorRenderable[];
  extra?: (context: ErrorRenderContext) => ReactNode;
  severity?: ErrorSeverity;
  docUrl?: string;
};

export type ErrorDisplayMode = 'modal' | 'message' | 'silent' | 'form' | 'page';

export type ErrorPolicy = {
  mode?: ErrorDisplayMode;
  field?: string;
};

export type ErrorRegistry = Record<string, ErrorExplanation>;

export type ErrorEvent = {
  error: ApiError;
  policy?: ErrorPolicy;
};

export type ErrorListener = (event: ErrorEvent) => void;

export declare const normalizeError: (error: unknown) => ApiError;

export declare const errorCenter: {
  subscribe(listener: ErrorListener): () => void;
  emit(error: unknown, policy?: ErrorPolicy): void;
};
