import * as React from "react";

export interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  code?: string;
  align?: "center" | "start" | "end";
  hideCode?: boolean;
  showDevicePreview?: boolean;
}

export interface ComponentInfo {
  component: React.LazyExoticComponent<React.ComponentType> | React.ComponentType;
  source?: string;
  type?: string;
  files?: string[];
}

export interface HardcodedComponent {
  component: React.ComponentType;
  code: string;
}

export type ViewMode = "mobile" | "desktop";
export type TabValue = "preview" | "code";