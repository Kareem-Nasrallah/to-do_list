import validationMessages from "./ValidationMessages";
import * as Yup from "yup";

const loginSchema = Yup.object({
  email: Yup.string()
    .required(validationMessages.required("email"))
    .email(validationMessages.invalidEmail)
    .max(50, validationMessages.maxLength(50)),
  password: Yup.string()
    .required(validationMessages.required("password"))
    .min(8, validationMessages.minLength(8)),
});

export default loginSchema;

// fristName: Yup.string().required(errorMess.required).max(30, )
