export interface ParsedArgs<
  FLAGS_KEY extends string,
  OPTIONS_KEY extends string
> {
  flags: Record<FLAGS_KEY, boolean | undefined>;
  options: Record<OPTIONS_KEY, string | undefined>;
  body: string;
}

export interface MemeTemplate<
  FLAGS_KEY extends string,
  OPTIONS_KEY extends string
> {
  commandNames: readonly string[];
  description: string;
  flagsKeys: readonly FLAGS_KEY[];
  optionsKeys: readonly OPTIONS_KEY[];
  errorMessage: string;
  generate(args: ParsedArgs<FLAGS_KEY, OPTIONS_KEY>, author: string): string;
}
