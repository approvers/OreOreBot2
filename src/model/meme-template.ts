export interface ParsedArgs<
  FLAGS_KEY extends string = never,
  OPTIONS_KEY extends string = never,
  REQ_POSITIONAL_KEY extends string = never,
  OPT_POSITIONAL_KEY extends string = never
> {
  flags: Record<FLAGS_KEY, boolean | undefined>;
  options: Record<OPTIONS_KEY, string | undefined>;
  requiredPositionals: Record<REQ_POSITIONAL_KEY, string>;
  optionalPositionals: Record<OPT_POSITIONAL_KEY, string | undefined>;
}

export interface MemeTemplate<
  FLAGS_KEY extends string = never,
  OPTIONS_KEY extends string = never,
  REQ_POSITIONAL_KEY extends string = never,
  OPT_POSITIONAL_KEY extends string = never
> {
  commandNames: readonly string[];
  description: string;
  flagsKeys?: readonly FLAGS_KEY[];
  optionsKeys?: readonly OPTIONS_KEY[];
  requiredPositionalKeys?: readonly REQ_POSITIONAL_KEY[];
  optionalPositionalKeys?: readonly OPT_POSITIONAL_KEY[];
  errorMessage: string;
  generate(
    args: ParsedArgs<
      FLAGS_KEY,
      OPTIONS_KEY,
      REQ_POSITIONAL_KEY,
      OPT_POSITIONAL_KEY
    >,
    author: string
  ): string;
}
