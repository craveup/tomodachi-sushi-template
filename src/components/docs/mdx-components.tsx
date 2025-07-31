"use client";

import * as React from "react";
import Link from "next/link";
import { MDXProvider } from "@mdx-js/react";
import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ComponentPreview } from "@/components/docs/component-preview";
import { Callout } from "@/components/callout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Simple ComponentCard for documentation
function ComponentCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <div className="group relative rounded-lg border p-6 shadow-md transition-shadow hover:shadow-lg">
      <h3 className="font-primary text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
      <Link
        href={href}
        className="absolute inset-0 rounded-lg hover:bg-muted/20 transition-colors"
      >
        <span className="sr-only">View {title}</span>
      </Link>
    </div>
  );
}

interface MDXComponentsProps {
  code: string;
}

// Helper function to generate slugs from heading text
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim();
}

const components = {
  h1: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = typeof children === "string" ? slugify(children) : undefined;
    return (
      <h1
        id={id}
        className={cn(
          "mt-2 scroll-m-20 text-4xl font-bold tracking-tight",
          className
        )}
        {...props}
      >
        {children}
      </h1>
    );
  },
  h2: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = typeof children === "string" ? slugify(children) : undefined;
    return (
      <h2
        id={id}
        className={cn(
          "font-primary text-3xl font-bold tracking-tight mt-10 scroll-m-20 border-b pb-1 first:mt-0",
          className
        )}
        {...props}
      >
        {children}
      </h2>
    );
  },
  h3: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = typeof children === "string" ? slugify(children) : undefined;
    return (
      <h3
        id={id}
        className={cn(
          "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
          className
        )}
        {...props}
      >
        {children}
      </h3>
    );
  },
  h4: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = typeof children === "string" ? slugify(children) : undefined;
    return (
      <h4
        id={id}
        className={cn(
          "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
          className
        )}
        {...props}
      >
        {children}
      </h4>
    );
  },
  h5: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = typeof children === "string" ? slugify(children) : undefined;
    return (
      <h5
        id={id}
        className={cn(
          "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
          className
        )}
        {...props}
      >
        {children}
      </h5>
    );
  },
  h6: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = typeof children === "string" ? slugify(children) : undefined;
    return (
      <h6
        id={id}
        className={cn(
          "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
          className
        )}
        {...props}
      >
        {children}
      </h6>
    );
  },
  a: ({ className, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <blockquote
      className={cn(
        "mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground",
        className
      )}
      {...props}
    />
  ),
  img: ({
    className,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={cn("rounded-md border", className)} alt={alt} {...props} />
  ),
  hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-4 md:my-8" {...props} />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn("w-full", className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn("m-0 border-t p-0 even:bg-muted", className)}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  pre: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLPreElement>) => {
    let code = "";
    let language = "tsx";
    if (React.isValidElement(children) && children.props) {
      code = children.props.children || "";
      const childClass = children.props.className || "";
      if (childClass.startsWith("language-")) {
        language = childClass.replace("language-", "");
      }
    } else if (typeof children === "string") {
      code = children;
    }
    return (
      <div
        style={{
          position: "relative",
          padding: "0.75rem 1rem",
          background: "#011627",
          borderRadius: "0.375rem",
          marginTop: "1rem",
        }}
      >
        <SyntaxHighlighter
          language={language}
          style={okaidia}
          PreTag="div"
          customStyle={{
            background: "#011627",
            padding: "0",
            margin: "0",
            borderRadius: "0",
            fontSize: "0.875rem",
            lineHeight: "1.25",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  },
  code: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLElement>) => {
    const hasLanguage = /language-(\w+)/.exec(className || "");

    if (hasLanguage) {
      // This is a code block, let pre handle it
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }

    // This is inline code
    return (
      <code
        className={cn(
          "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
          className
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
  // Custom components for documentation
  ComponentCard,
  ComponentPreview,
  Callout,
  Tabs: ({ className, ...props }: React.ComponentProps<typeof Tabs>) => (
    <Tabs className={cn("mt-6", className)} {...props} />
  ),
  TabsContent: ({
    className,
    ...props
  }: React.ComponentProps<typeof TabsContent>) => (
    <TabsContent className={cn("mt-6", className)} {...props} />
  ),
  TabsList,
  TabsTrigger,
  // Simple Steps components for documentation
  Steps: ({ ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
      className="[&>h3]:step steps mb-12 ml-4 border-l pl-8 [counter-reset:step]"
      {...props}
    />
  ),
  Step: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        "font-display mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  ComponentSource: ({ name, ...props }: { name: string }) => (
    <div className="relative">
      <pre className="mb-4 mt-6 overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900">
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm text-zinc-50">
          {`// Component source code for ${name} would appear here`}
        </code>
      </pre>
    </div>
  ),
  PropsTable: ({ data }: { data: any }) => (
    <div className="my-6 overflow-hidden rounded-lg border">
      <table className="w-full">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="p-4 text-left">Prop</th>
            <th className="p-4 text-left">Type</th>
            <th className="p-4 text-left">Default</th>
            <th className="p-4 text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((prop: any, index: number) => (
            <tr key={index} className="border-b">
              <td className="p-4 font-mono text-sm">{prop.name}</td>
              <td className="p-4 font-mono text-sm">{prop.type}</td>
              <td className="p-4 font-mono text-sm">{prop.default || "-"}</td>
              <td className="p-4 text-sm">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

export function MDXComponents({ code }: MDXComponentsProps) {
  const [Component, setComponent] = React.useState<React.ComponentType | null>(
    null
  );
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!code) return;

    async function processMDX() {
      try {
        const compiled = await compile(code, {
          outputFormat: "function-body",
          development: false,
          providerImportSource: "@mdx-js/react",
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug],
        });

        const { default: MDXContent } = await run(compiled, {
          ...runtime,
          baseUrl: import.meta.url,
          useMDXComponents: () => components,
        });

        setComponent(() => MDXContent);
        setError(null);
      } catch (err) {
        console.error("Error compiling MDX:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    }

    processMDX();
  }, [code]);

  if (!code) {
    return (
      <div className="mdx prose prose-gray dark:prose-invert max-w-none">
        <p>Content is not available yet.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mdx prose prose-gray dark:prose-invert max-w-none">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error processing MDX: {error}</p>
        </div>
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="mdx prose prose-gray dark:prose-invert max-w-none">
        <p>Loading content...</p>
      </div>
    );
  }

  return (
    <div className="mdx">
      <Component />
    </div>
  );
}
