import { SchemaConfig } from './types'

export class RypeError extends Error {
  isRypeError = true
}

export class RypeDevError extends RypeError {
  isRypeDevError = true
}

export class RypeClientError extends RypeError {
  input: unknown
  schema: unknown
  config?: SchemaConfig
  isRypeClientError = true

  constructor(
    message: string,
    options: { schema: unknown; input: unknown; config: SchemaConfig }
  ) {
    super(message)
    this.input = options.input
    this.schema = options.schema
    this.config = options.config
  }
}

export class RypeTypeError extends RypeClientError {
  isRypeTypeError = true
}
export class RypeRequiredError extends RypeClientError {
  isRypeRequiredError = true
}
