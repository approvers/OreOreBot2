declare const snowflakeNominal: unique symbol;
export type Snowflake = string & { [snowflakeNominal]: never };

export const unknownId = 'unknown' as Snowflake;
