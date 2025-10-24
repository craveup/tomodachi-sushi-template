import { toc } from "mdast-util-toc";
import { remark } from "remark";
import { visit } from "unist-util-visit";

interface TableOfContentsItem {
  title: string;
  url: string;
  items?: TableOfContentsItem[];
}

interface TableOfContents {
  items: TableOfContentsItem[];
}

export async function getTableOfContents(
  content: string
): Promise<TableOfContents> {
  const tree = await remark().parse(content);
  const tocTree = toc(tree, {
    tight: true,
    maxDepth: 4,
    skip: "title|Table of Contents",
  });
  const result: TableOfContents = { items: [] };

  if (tocTree.map) {
    visit(tocTree.map, (node) => {
      if (node.type === "list") {
        // @ts-ignore
        const newItems = transformListItems(node.children);
        if (result.items.length === 0) {
          // Only set items if we don't have any yet (take the first/main list)
          result.items = newItems;
        }
      }
    });
  }

  return result;
}

function transformListItems(items: any[]): TableOfContentsItem[] {
  return items
    .map((item) => {
      const result: TableOfContentsItem = {
        title: "",
        url: "",
        items: [],
      };

      if (item.children) {
        for (const child of item.children) {
          if (
            child.type === "paragraph" &&
            child.children?.[0]?.type === "link"
          ) {
            // Extract full text content from the link, handling complex structures
            const link = child.children[0];
            let fullTitle = "";

            // Recursively extract text from all children nodes
            function extractText(node: any): string {
              if (node.type === "text") {
                return node.value || "";
              }
              if (node.children) {
                return node.children.map(extractText).join("");
              }
              return "";
            }

            fullTitle = link.children.map(extractText).join("").trim();

            result.title = fullTitle || "";
            result.url = link.url || "";
          }

          if (child.type === "list") {
            result.items = transformListItems(child.children);
          }
        }
      }

      return result;
    })
    .filter((item) => item.title.trim() !== "" && item.url !== ""); // Filter out empty items
}
