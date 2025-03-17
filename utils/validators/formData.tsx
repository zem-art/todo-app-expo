export type ValidationRule<T> = (value: T) => string | undefined;
export type ValidationSchema<T> = { [K in keyof T]?: ValidationRule<T[K]> };

export const validateForm = <T extends Record<string, any>>(
  formData: T,
  validationSchema: ValidationSchema<T>,
  setFormDataError: (errors: Partial<Record<keyof T, string>>) => void
): boolean => {
  const errors: Partial<Record<keyof T, string>> = {};

  Object.keys(validationSchema).forEach((key) => {
    const field = key as keyof T;
    const validator = validationSchema[field];

    if (validator) {
      const errorMessage = validator(formData[field]);
      if (errorMessage) {
        errors[field] = errorMessage;
      }
    }
  });

  setFormDataError(errors);
  return Object.keys(errors).length === 0;
};
