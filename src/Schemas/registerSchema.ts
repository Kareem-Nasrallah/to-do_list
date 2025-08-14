import * as Yup from "yup";
import validationMessages from "./ValidationMessages";

const registerSchema = Yup.object({
  name: Yup.string()
    .required(validationMessages.required("name"))
    .max(30, validationMessages.maxLength(30)),
  email: Yup.string()
    .required(validationMessages.required("email"))
    .email(validationMessages.invalidEmail)
    .max(50, validationMessages.maxLength(50)),
  password: Yup.string()
    .required(validationMessages.required("password"))
    .min(8, validationMessages.minLength(8)),
  confirmPassword: Yup.string()
    .required(validationMessages.required("password"))
    .oneOf([Yup.ref("password"), ""], validationMessages.confirmPasswordError),
});

export default registerSchema;
