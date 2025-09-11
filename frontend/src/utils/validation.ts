// Single Responsibility: Each validator has one job
export abstract class BaseValidator<T> {
  abstract validate(value: T): string | null;
}

export class RequiredValidator extends BaseValidator<string> {
  constructor(private readonly message: string = "This field is required") {
    super();
  }

  validate(value: string): string | null {
    return value.trim().length === 0 ? this.message : null;
  }
}

export class MinLengthValidator extends BaseValidator<string> {
  constructor(
    private readonly minLength: number,
    private readonly message?: string
  ) {
    super();
  }

  validate(value: string): string | null {
    const trimmedValue = value.trim();
    if (trimmedValue.length < this.minLength) {
      return this.message || `Must be at least ${this.minLength} characters`;
    }
    return null;
  }
}

export class MaxLengthValidator extends BaseValidator<string> {
  constructor(
    private readonly maxLength: number,
    private readonly message?: string
  ) {
    super();
  }

  validate(value: string): string | null {
    const trimmedValue = value.trim();
    if (trimmedValue.length > this.maxLength) {
      return (
        this.message || `Must be no more than ${this.maxLength} characters`
      );
    }
    return null;
  }
}

export class EmailValidator extends BaseValidator<string> {
  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(private readonly message: string = "Please enter a valid email") {
    super();
  }

  validate(value: string): string | null {
    return !this.emailRegex.test(value.trim()) ? this.message : null;
  }
}

export class NumberValidator extends BaseValidator<string> {
  constructor(private readonly message: string = "Must be a valid number") {
    super();
  }

  validate(value: string): string | null {
    const num = Number(value);
    return isNaN(num) || num <= 0 ? this.message : null;
  }
}

// Open/Closed Principle: Extensible validation without modifying existing code
export class CompositeValidator<T> extends BaseValidator<T> {
  constructor(private readonly validators: BaseValidator<T>[]) {
    super();
  }

  validate(value: T): string | null {
    for (const validator of this.validators) {
      const error = validator.validate(value);
      if (error) return error;
    }
    return null;
  }
}

// Factory pattern for creating field validators
export class ValidationFactory {
  static createNameValidator(): CompositeValidator<string> {
    return new CompositeValidator([
      new RequiredValidator("Name is required"),
      new MinLengthValidator(2, "Name must be at least 2 characters"),
    ]);
  }

  static createUsernameValidator(): CompositeValidator<string> {
    return new CompositeValidator([
      new RequiredValidator("Username is required"),
      new MinLengthValidator(3, "Username must be at least 3 characters"),
    ]);
  }

  static createEmailValidator(): CompositeValidator<string> {
    return new CompositeValidator([
      new RequiredValidator("Email is required"),
      new EmailValidator(),
    ]);
  }

  // Post validators
  static createPostTitleValidator(): CompositeValidator<string> {
    return new CompositeValidator([
      new RequiredValidator("Title is required"),
      new MinLengthValidator(5, "Title must be at least 5 characters"),
      new MaxLengthValidator(100, "Title must be no more than 100 characters"),
    ]);
  }

  static createPostBodyValidator(): CompositeValidator<string> {
    return new CompositeValidator([
      new RequiredValidator("Body is required"),
      new MinLengthValidator(10, "Body must be at least 10 characters"),
      new MaxLengthValidator(1000, "Body must be no more than 1000 characters"),
    ]);
  }

  static createUserIdValidator(): CompositeValidator<string> {
    return new CompositeValidator([
      new RequiredValidator("User is required"),
      new NumberValidator("Please select a valid user"),
    ]);
  }
}
