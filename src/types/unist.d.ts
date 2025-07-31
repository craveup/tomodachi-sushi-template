declare module "types/unist" {
  export interface UnistNode {
    type: string
    name?: string
    tagName?: string
    value?: string
    properties?: {
      __rawString__?: string
      __npmCommand__?: string
      __yarnCommand__?: string
      __pnpmCommand__?: string
      __bunCommand__?: string
      __src__?: string
      __style__?: string
      __event__?: string
      className?: string[]
      [key: string]: any
    }
    attributes?: {
      name: string
      type?: string
      value: any
    }[]
    children?: UnistNode[]
    data?: {
      meta?: string
      [key: string]: any
    }
    position?: {
      start: { line: number; column: number; offset: number }
      end: { line: number; column: number; offset: number }
    }
    [key: string]: any
  }

  export interface UnistTree {
    type: string
    children: UnistNode[]
    [key: string]: any
  }
}
