const validationMessages = {
  required: (fieldName: string) => `your ${fieldName} is required`,
  invalidEmail: "Invalid email address",
  maxLength: (value: number) => `Must be at most ${value} characters`,
  minLength: (value: number) => `Must be at least ${value} characters`,
  confirmPasswordError: "Passwords must match",
};
export default validationMessages;
