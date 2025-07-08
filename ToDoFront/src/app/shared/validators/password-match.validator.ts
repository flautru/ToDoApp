import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormGroup,
} from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (
  group: AbstractControl,
): ValidationErrors | null => {
  if (!(group instanceof FormGroup)) return null;

  const passwordControl = group.get('password');
  const confirmPasswordControl = group.get('confirmPassword');

  if (!passwordControl || !confirmPasswordControl) return null;

  const password = passwordControl.value;
  const confirmPassword = confirmPasswordControl.value;

  if (password !== confirmPassword) {
    confirmPasswordControl.setErrors({ passwordMismatch: true });
  } else {
    if (confirmPasswordControl.hasError('passwordMismatch')) {
      const errors = { ...confirmPasswordControl.errors };
      delete errors['passwordMismatch'];
      confirmPasswordControl.setErrors(
        Object.keys(errors).length ? errors : null,
      );
    }
  }

  return null;
};
