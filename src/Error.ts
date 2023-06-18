import { Schema } from './Type-type'

export class RypeError extends Error {
  instance: {
    args: any[]
    required: boolean
  }

  constructor(
    message: string,
    args: (Schema | string | number | boolean)[],
    required: boolean
  ) {
    super(message)
    this.instance = { args, required }
  }
}

export class RypeTypeError extends RypeError {}
export class RypeRequiredError extends RypeError {}
