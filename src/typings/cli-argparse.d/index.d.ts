declare module 'cli-argparse' {
  export default function parse(
    args?: readonly string[],
    options?: Partial<Readonly<ParseOptions>>
  ): ParseResult;

  export interface ParseOptions {
    alias: Record<string, string>;
    flags: readonly string[];
    options: readonly string[];
    short: boolean;
    strict: boolean;
    flat: boolean;
    stop: readonly string[];
    vars: readonly (string | RegExp)[];
    camelcase: boolean;
  }

  export interface ParseResult {
    flags: Record<string, boolean>;
    options: Record<string, string | string[]>;
    raw: string[];
    stdin: boolean;
    unparsed: string[];
    strict: boolean;
    vars: {
      symbols: Record<string, string>;
      collection: Record<string, string>;
    };
  }
}
