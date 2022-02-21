declare const snowflakeNominal: unique symbol;
export type Snowflake = string & { [snowflakeNominal]: never };
