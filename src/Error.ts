import { SchemaConfig } from './config'

export class RypeError extends Error {
  public isRypeError = true
}

export class RypeDevError extends RypeError {
  public isRypeDevError = true
}

export class RypeClientError extends RypeError {
  public input: unknown
  public schema: unknown
  public config?: SchemaConfig
  public isRypeClientError = true

  public constructor(
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
  public isRypeTypeError = true
}
export class RypeRequiredError extends RypeClientError {
  public isRypeRequiredError = true
}
