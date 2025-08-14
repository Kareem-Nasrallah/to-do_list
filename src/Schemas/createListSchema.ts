import * as Yup from "yup";
import validationMessages from "./ValidationMessages";

//   listId: 0,
//   listName: "",
//   icon: "",
//   date: "",
//   done: false,
//   tasks: [],

const createListSchema = Yup.object({
  listId: Yup.string(),
  listName: Yup.string()
    .required(validationMessages.required("list Name"))
    .max(30, validationMessages.maxLength(30)),
  date: Yup.string(),
  done: Yup.boolean(),
  tasks: Yup.array()
    .of(
      Yup.object({
        taskId: Yup.string(),
        taskName: Yup.string()
          .required("Task name is required")
          .trim()
          .min(1, "Task name is required")
          .max(30, validationMessages.maxLength(30)),
        completed: Yup.boolean(),
      })
    )
    .min(1, "You must add at least one task")
    .required("You must add at least one task"),
});

export default createListSchema;
