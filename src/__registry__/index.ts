// Component registry for rehype-component
// This is a stub file to satisfy the import requirement

export interface ComponentInfo {
  name: string;
  files: string[];
  type: "components:ui" | "components:component" | "components:example";
}

export const Index: Record<string, ComponentInfo> = {
  // Add component registry items as needed
};