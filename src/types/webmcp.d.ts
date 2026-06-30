interface WebMCPInputSchema {
  type: "object";
  properties: Record<string, unknown>;
  required?: string[];
}

interface WebMCPToolDefinition {
  name: string;
  description: string;
  inputSchema: WebMCPInputSchema;
  execute: (input: unknown) => Promise<string | null> | string | null;
  annotations?: {
    readOnlyHint?: boolean;
    untrustedContentHint?: boolean;
  };
}

interface WebMCPRegistration {
  unregister: () => void;
}

interface WebMCPModelContext {
  registerTool: (tool: WebMCPToolDefinition) => WebMCPRegistration | undefined;
  unregisterTool?: (name: string) => void;
}

interface Document {
  modelContext?: WebMCPModelContext;
}

interface Navigator {
  modelContext?: WebMCPModelContext;
}
