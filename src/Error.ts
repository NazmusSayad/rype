import { SchemaConfig } from './types'

export class RypeError extends Error {}

export class RypeDevError extends RypeError {}

export class RypeClientError extends RypeError {
  input: unknown
  schema: unknown
  config: SchemaConfig

  constructor(
    message: string,
    schema: unknown,
    input: unknown,
    config: SchemaConfig
  ) {
    super(message)
    this.input = input
    this.schema = schema
    this.config = config
  }
}

export class RypeTypeError extends RypeClientError {}
export class RypeRequiredError extends RypeClientError {}
