import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CommonValidators {

  static integerMaxValue = 2000000000;

  // Checks if control is null or whitespace
  static notEmptyString(c: FormControl): ValidationErrors | null {
    const isWhitespace = (c.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { notEmpty: true };
  }

  // maxlength validator for inputs type number
  static numbersMaxLength(maxLength: number): ValidatorFn {

    return (c: AbstractControl): ValidationErrors | null => {
      const isValid = (c.value || '').toString().trim().length <= maxLength;
      return isValid ? null : { maxLength: true };
    };

  }

  // minLength validator for inputs type number
  static numbersMinLength(minLength: number): ValidatorFn {

    return (c: AbstractControl): ValidationErrors | null => {
      const isValid = (c.value || '').toString().trim().length >= minLength;
      return isValid ? null : { minLength: true };
    };
  }

}
