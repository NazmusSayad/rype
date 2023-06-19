import { Schema } from './Type-type'

export class RypeError extends Error {
  instance: {
    schema: any[]
    required: boolean
  }

  constructor(
    message: string,
    schema: (Schema | string | number | boolean)[],
    required: boolean
  ) {
    super(message)
    this.instance = { schema, required }
  }
}

export class RypeTypeError extends RypeError {}
export class RypeRequiredError extends RypeError {}
