export class RypeError extends Error {}

export class RypeDevError extends RypeError {}

export class RypeClientError extends RypeError {
  config: {
    input: unknown
    schema: unknown
    required: boolean
  }

  constructor(
    message: string,
    input: unknown,
    schema: unknown,
    required: boolean
  ) {
    super(message)
    this.config = { input, schema, required }
  }
}

export class RypeTypeError extends RypeClientError {}
export class RypeRequiredError extends RypeClientError {}
