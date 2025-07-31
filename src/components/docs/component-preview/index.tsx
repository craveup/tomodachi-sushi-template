"use client";

import * as React from "react";
import { Loader2Icon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import types
import type { ComponentPreviewProps, ViewMode } from "./types";

// Import components
import {
  CopyButton,
  CodeBlock,
  PreviewContainer,
  IPhoneMockup,
  DesktopMockup,
} from "./components";
import { ComponentErrorBoundary } from "./components/error-boundary";

// Import hooks
import { useComponentLoader } from "./hooks/use-component-loader";
import { cn } from "@/lib/utils";

export function ComponentPreview({
  name,
  code,
  children,
  className,
  align = "center",
  hideCode = false,
  showDevicePreview = false,
  ...props
}: ComponentPreviewProps) {
  const [viewMode, setViewMode] = React.useState<ViewMode>("mobile");
  const { Component, componentCode, isLoading, error } =
    useComponentLoader(name);

  const displayCode = code || componentCode;

  // Render the component content
  const renderContent = () => {
    // Use children if provided
    if (children) {
      return children;
    }

    // Show loading state
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      );
    }

    // Show error state
    if (error) {
      return (
        <div className="w-full text-center py-8">
          <p className="text-muted-foreground">
            Component preview not available
          </p>
          {process.env.NODE_ENV === "development" && (
            <p className="text-xs text-red-500 mt-2">{error}</p>
          )}
        </div>
      );
    }

    // Show component
    if (Component) {
      return (
        <ComponentErrorBoundary>
          <Component />
        </ComponentErrorBoundary>
      );
    }

    // Default state
    return (
      <div className="w-full text-center py-8">
        <p className="text-muted-foreground">Component preview not available</p>
      </div>
    );
  };

  return (
    <div
      className={cn("group relative my-4 flex flex-col space-y-2", className)}
      {...props}
    >
      <Tabs defaultValue="preview" className="relative mr-auto w-full">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center space-x-4">
            {!hideCode && (
              <TabsList className="justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                  value="preview"
                  className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  Preview
                </TabsTrigger>
                <TabsTrigger
                  value="code"
                  className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  Code
                </TabsTrigger>
              </TabsList>
            )}
          </div>
        </div>

        <TabsContent value="preview" className="relative rounded-md border">
          <div className="flex items-center justify-end p-4">
            <CopyButton value={displayCode} />
          </div>

          {showDevicePreview ? (
            viewMode === "mobile" ? (
              <IPhoneMockup>{renderContent()}</IPhoneMockup>
            ) : (
              <DesktopMockup>{renderContent()}</DesktopMockup>
            )
          ) : (
            <PreviewContainer align={align}>{renderContent()}</PreviewContainer>
          )}
        </TabsContent>

        {!hideCode && displayCode && (
          <TabsContent value="code">
            <CodeBlock code={displayCode} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
