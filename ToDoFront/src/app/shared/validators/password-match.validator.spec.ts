import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { passwordMatchValidator } from './password-match.validator';

describe('passwordMatchValidator', () => {
  it('should set passwordMismatch error if passwords do not match', () => {
    const form = new FormGroup(
      {
        password: new FormControl('abc123'),
        confirmPassword: new FormControl('xyz789'),
      },
      { validators: passwordMatchValidator }
    );

    form.updateValueAndValidity();

    expect(form.get('confirmPassword')?.errors).toEqual({
      passwordMismatch: true,
    });
  });

  it('should clear passwordMismatch error if passwords match again', () => {
    const form = new FormGroup(
      {
        password: new FormControl('abc123'),
        confirmPassword: new FormControl('abc123'),
      },
      { validators: passwordMatchValidator }
    );

    form.updateValueAndValidity();

    expect(form.get('confirmPassword')?.errors).toBeNull();
  });

  it('should remove passwordMismatch error if it existed and passwords now match', () => {
    const form = new FormGroup(
      {
        password: new FormControl('initial'),
        confirmPassword: new FormControl('mismatch'),
      },
      { validators: passwordMatchValidator }
    );

    form.updateValueAndValidity();
    expect(form.get('confirmPassword')?.errors).toEqual({
      passwordMismatch: true,
    });

    form.get('confirmPassword')?.setValue('initial');

    form.updateValueAndValidity();
    expect(form.get('confirmPassword')?.errors).toBeNull();
  });

  it('should clear all errors if passwordMismatch is the only one', () => {
    const form = new FormGroup({
      password: new FormControl('abc123'),
      confirmPassword: new FormControl('abc123'),
    });

    form.get('confirmPassword')?.setErrors({ passwordMismatch: true });

    passwordMatchValidator(form);

    expect(form.get('confirmPassword')?.errors).toBeNull();
  });

  it('should return null if control is not a FormGroup', () => {
    const fakeControl = {
      get: () => null,
    } as unknown as AbstractControl;

    const result = passwordMatchValidator(fakeControl);

    expect(result).toBeNull();
  });

  it('should return null if password or confirmPassword control is missing', () => {
    const incompleteForm1 = new FormGroup({
      confirmPassword: new FormControl('abc123'),
    });
    expect(passwordMatchValidator(incompleteForm1)).toBeNull();

    const incompleteForm2 = new FormGroup({
      password: new FormControl('abc123'),
    });
    expect(passwordMatchValidator(incompleteForm2)).toBeNull();
  });
});
