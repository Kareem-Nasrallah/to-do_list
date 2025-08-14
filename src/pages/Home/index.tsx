import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ListWindow from "../../componentes/ListWindow";
import { FaArrowRightLong } from "react-icons/fa6";
import { GoIssueClosed } from "react-icons/go";
import HomeHeader from "./HomeHeader";
import { FormikHelpers, useFormik } from "formik";
import createListSchema from "../../Schemas/createListSchema";

interface TaskType {
  taskId: string;
  taskName: string;
  completed: boolean;
}
interface ToDoListType {
  listId: string;
  listName: string;
  icon: string;
  date: string;
  done: boolean;
  tasks: TaskType[];
}

const Home = () => {
  const userEmail = useSelector((state: RootState) => state.user.userEmail);

  // Load saved lists from localStorage based on user email
  const ListsData = JSON.parse(localStorage.getItem(userEmail) || "[]");

  const [createToDoList, setCreateToDoList] = useState(false);
  const [search, setSearch] = useState("");
  const [newTask, setNewTask] = useState("");
  const [render, setRender] = useState(false);
  const [sortOrder, setSortOrder] = useState("Sort by");

  const addTask = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (newTask.trim() === "") {
      e.preventDefault();
      return;
    }
    e.preventDefault();

    const newTaskItem = {
      taskId: (formik.values.tasks.length + 1).toString(),
      taskName: newTask,
      completed: false,
    };

    const updatedTasks = [...formik.values.tasks, newTaskItem];

    formik.setFieldValue("tasks", updatedTasks);

    setNewTask("");
  };

  // Submit and save new to-do list
  const createList = (
    values: ToDoListType,
    actions: FormikHelpers<ToDoListType>
  ) => {
    setCreateToDoList(false);

    const prevData = JSON.parse(localStorage.getItem(userEmail) || "[]");

    const oldDataList = prevData || [];

    const datetime = new Date();
    const date = datetime.toLocaleDateString("en-US");
    const time = datetime.toLocaleTimeString("en-US");

    const newList = {
      ...values,
      date: date,
      listId: `${time}_${values.listName}`,
    };

    const newDataLists = [...oldDataList, newList];
    localStorage.setItem(userEmail, JSON.stringify(newDataLists));

    // Reset form after creating the list
    actions.resetForm();
  };

  // Sort lists based on user selection
  const sortedLists: ToDoListType[] = [...ListsData].sort((a, b) => {
    switch (sortOrder) {
      case "latest":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "az":
        return a.listName.localeCompare(b.listName);
      case "za":
        return b.listName.localeCompare(a.listName);
      default:
        return 0;
    }
  });

  const formik = useFormik<ToDoListType>({
    initialValues: {
      listId: "",
      listName: "",
      icon: "",
      date: "",
      done: false,
      tasks: [],
    },
    validationSchema: createListSchema,
    onSubmit: createList,
  });

  return (
    <div
      className="px-6 py-2 overflow-auto"
      style={{ height: "calc(100vh - 94px - 94px )" }}
    >
      {/* Header and search/sort controls */}
      <HomeHeader
        createToDoList={createToDoList}
        setCreateToDoList={setCreateToDoList}
        search={search}
        setSearch={setSearch}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {/* Form for creating a new list */}
      <form
        onSubmit={formik.handleSubmit}
        className={`lg:w-2/3 w-4/5 p-2 mx-auto mb-5 transition-all ${
          createToDoList
            ? "scale-100 max-h-[230px] overflow-y-auto"
            : "scale-95 max-h-0 overflow-hidden"
        }`}
      >
        <div className="w-full flex sm:flex-row flex-col items-center gap-2 my-2">
          <input
            id="listName"
            type="text"
            placeholder="To Do List Name"
            className={`text-info-content input sm:w-2/3 w-full input-primary input-md block focus:border-primary  ${
              formik.errors.listName && formik.touched.listName
                ? "border-red-500"
                : "border-indigo-300"
            }`}
            {...formik.getFieldProps("listName")}
          />

          {/* File input for list icon */}
          {!formik.values.icon ? (
            <label
              className="sm:w-1/3 w-full h-10 cursor-pointer btn btn-primary btn-dash text-lg"
              htmlFor="icon"
            >
              add List icon
            </label>
          ) : (
            <label
              className="sm:w-1/3 w-full h-10 cursor-pointer btn btn-primary btn-outline text-lg"
              htmlFor="icon"
            >
              <GoIssueClosed className="text-2xl text-green-500 font-extrabold" />{" "}
              .. chang icon
            </label>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="icon"
            onChange={(e) => {
              const image = e.currentTarget.files?.[0];
              if (image) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  formik.setFieldValue("icon", reader.result);
                };
                reader.readAsDataURL(image);
              }
            }}
          />
        </div>
        <div className="w-full flex items-center gap-2 text-error -mt-1 text-sm ">
          {formik.errors.listName && formik.touched.listName && (
            <p className=" w-2/3">{formik.errors.listName}</p>
          )}

          {formik.errors.icon && formik.touched.icon && (
            <p className=" w-1/3">{formik.errors.icon}</p>
          )}
        </div>

        {/* Display added tasks */}
        {formik.values.tasks.map((task, index) => (
          <div key={index} className="my-2">
            <label className="fieldset-label w-fit">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                name={`tasks[${index}].completed`}
                id={task.taskId}
                checked={task.completed}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <p className="text-slate-700 dark:text-indigo-200">
                {task.taskName}
              </p>
            </label>
          </div>
        ))}

        {/* Input to add new task */}
        <div className="relative my-2 w-full">
          <input
            id="tasks"
            type="text"
            placeholder="Add Task"
            className={`text-info-content w-full input input-primary input-md focus:border-primary ${
              formik.touched.tasks &&
              formik.errors.tasks &&
              newTask.trim() === ""
                ? "border-red-500"
                : "border-indigo-300"
            }`}
            value={newTask}
            onChange={(e) => {
              setNewTask(e.target.value);
            }}
          />
          <button
            className="btn btn-primary absolute top-0 right-0 rounded-s-none text-2xl p-2"
            type="submit"
            onClick={addTask}
          >
            <FaArrowRightLong />
          </button>
        </div>

        {formik.touched.tasks &&
          formik.errors.tasks &&
          typeof formik.errors.tasks === "string" && (
            <p className="text-error -mt-1 text-sm">{formik.errors.tasks}</p>
          )}

        <button
          type="submit"
          className="btn btn-primary w-2/3 block mx-auto text-xl mt-4"
        >
          create
        </button>
      </form>

      {/* Conditional rendering of lists */}
      {sortedLists.length < 1 ? (
        <div className="h-[50vh] flex items-center justify-center">
          <h3 className="text-center text-2xl ">
            Please creat a new To-Do List
          </h3>
        </div>
      ) : search === "" || createToDoList ? (
        <div className="grid sm:grid-cols-[repeat(auto-fill,minmax(288px,1fr))] grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 items-center justify-start pb-4">
          {sortedLists!.map((list: ToDoListType) => (
            <ListWindow
              key={list.listId}
              listId={list.listId}
              listName={list.listName}
              icon={list.icon}
              date={list.date}
              tasks={list.tasks}
              done={list.done}
              setRender={setRender}
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 flex-wrap items-center justify-start pb-4">
          {sortedLists!
            .filter((list: ToDoListType) =>
              list.listName.toLowerCase().includes(search.toLowerCase())
            )
            .map((list: ToDoListType) => (
              <ListWindow
                key={list.listId}
                listId={list.listId}
                listName={list.listName}
                icon={list.icon}
                date={list.date}
                tasks={list.tasks}
                done={list.done}
                setRender={setRender}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default Home;
