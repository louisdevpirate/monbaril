"use client";

import { useEffect, useRef } from "react";

interface WebMCPToolConfig<TInput> {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
  execute: (input: TInput) => Promise<string | null> | string | null;
  annotations?: {
    readOnlyHint?: boolean;
    untrustedContentHint?: boolean;
  };
  enabled?: boolean;
}

/**
 * Enregistre un tool WebMCP avec cleanup automatique.
 * Fonctionne sur Chrome 149+ avec le token d'origin trial WebMCP.
 * L'API a migré de navigator.modelContext (<= Chrome 149) vers
 * document.modelContext (Chrome 150+) — on supporte les deux.
 * Sur les autres navigateurs ou sans token, c'est un no-op silencieux.
 */
export function useWebMCPTool<TInput = Record<string, unknown>>(
  config: WebMCPToolConfig<TInput>
) {
  const executeRef = useRef(config.execute);
  executeRef.current = config.execute;

  const enabled = config.enabled ?? true;
  const defKey = `${config.name}|${config.description}|${JSON.stringify(
    config.inputSchema
  )}|${JSON.stringify(config.annotations ?? {})}`;

  useEffect(() => {
    if (!enabled) return;
    if (typeof document === "undefined") return;
    const ctx = document.modelContext ?? navigator.modelContext;
    if (!ctx?.registerTool) return;

    let registration: WebMCPRegistration | undefined;
    try {
      registration = ctx.registerTool({
        name: config.name,
        description: config.description,
        inputSchema: config.inputSchema,
        annotations: config.annotations,
        execute: async (input) => {
          try {
            return await executeRef.current(input as TInput);
          } catch (err) {
            console.error(`[WebMCP] tool "${config.name}" failed:`, err);
            return `Erreur lors de l'exécution de ${config.name}`;
          }
        },
      });
    } catch (err) {
      console.warn(`[WebMCP] could not register tool "${config.name}":`, err);
    }

    return () => {
      try {
        registration?.unregister();
      } catch (err) {
        console.warn(
          `[WebMCP] could not unregister tool "${config.name}":`,
          err
        );
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, defKey]);
}
