import { Schema } from './Type-type'

export class RypeError extends Error {
  config: {
    input: unknown
    schema: any[]
    required: boolean
  }

  constructor(
    message: string,
    input: unknown,
    schema: (Schema | string | number | boolean)[],
    required: boolean
  ) {
    super(message)
    this.config = { input, schema, required }
  }
}

export class RypeTypeError extends RypeError {}
export class RypeRequiredError extends RypeError {}
