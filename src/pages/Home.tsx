import { ChangeEvent, FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import ListWindow from "../componentes/ListWindow";
import { FaArrowRightLong } from "react-icons/fa6";

const Home = () => {
  const userEmail = useSelector((state: RootState) => state.user.userEmail);

  const ListsData = JSON.parse(localStorage.getItem(userEmail) || "[]");

  interface TaskType {
    taskName: string;
    completed: boolean;
  }
  interface ToDoListType {
    listId: number;
    listName: string;
    date: string;
    done: boolean;
    tasks: TaskType[];
  }

  const [createToDoList, setCreateToDoList] = useState(false);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    listId: 0,
    listName: "",
    date: "",
    done: false,
    tasks: [],
  } as ToDoListType);
  const [newTask, setNewTask] = useState("");
  const [validate, setValidate] = useState(false);

  const addTask = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (newTask == "") {
      return;
    }
    setNewTask("");
    setForm({
      ...form,
      tasks: [...form.tasks, { taskName: newTask, completed: false }],
    });
  };

  const createList = (e: FormEvent<HTMLElement>) => {
    e.preventDefault();

    if (form.listName == "" || form.tasks.length < 1) {
      setValidate(true);
      return;
    }
    setCreateToDoList(false);
    setValidate(false);

    const prevData = JSON.parse(localStorage.getItem(userEmail) || "[]");

    const oldDataList = prevData ? prevData : [];

    const date = new Date().toLocaleDateString("en-US");
    const newList = {
      ...form,
      date: date,
    };

    const newDataLists = [...oldDataList, newList];
    localStorage.setItem(userEmail, JSON.stringify(newDataLists));
    setForm({
      listId: 0,
      listName: "",
      date: "",
      done: false,
      tasks: [],
    });
  };

  return (
    <div className="min-h-[77vh]">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-3xl font-semibold">All To-Dos</h2>
        {!createToDoList && (
          <label className="floating-label mt-4 text-primary w-1/2 min-w-xs">
            <span>Search by Task Name</span>
            <input
              type="text"
              value={search}
              placeholder="Search by Task Name"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              className="input input-primary text-info-content input-md w-full border-indigo-300 focus:border-primary"
            />
          </label>
        )}
        <button
          onClick={() => setCreateToDoList(!createToDoList)}
          className="btn btn-primary block my-2"
        >
          New List
        </button>
      </div>
      <form
        onSubmit={createList}
        className={`w-2/3 overflow-auto mx-auto my-5 transition-all ${
          createToDoList ? "scale-100 max-h-[230px]" : "scale-95 max-h-0"
        }`}
      >
        <div className="w-full flex items-center gap-2">
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm({
                ...form,
                listId: ListsData?.length + 1 || 1,
                listName: e.target.value,
              })
            }
            value={form.listName}
            type="text"
            placeholder="To Do List Name"
            className={`text-info-content my-2 input w-2/3 input-primary input-md block focus:border-primary  ${
              form.listName == "" && validate
                ? "border-red-500"
                : "border-indigo-300"
            }`}
          />
          <input
            type="file"
            accept="image/*"
            className="input input-primary w-1/3"
          />
        </div>
        {form.tasks.map((task, index) => (
          <div key={index} className="my-2">
            <label className="fieldset-label w-fit">
              <input
                type="checkbox"
                checked={task.completed}
                className="checkbox checkbox-primary"
                onChange={() => {
                  const updateTask = [...form.tasks];
                  updateTask[index] = {
                    ...updateTask[index],
                    completed: !updateTask[index].completed,
                  };

                  setForm({ ...form, tasks: updateTask });
                }}
              />
              <p className="text-slate-700 dark:text-indigo-200">
                {task.taskName}
              </p>
            </label>
          </div>
        ))}
        <div className="relative my-2 w-full">
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewTask(e.target.value)
            }
            value={newTask}
            type="text"
            placeholder="Add Task"
            className={`text-info-content w-full input input-primary input-md focus:border-primary ${
              form.tasks.length < 1 && validate
                ? "border-red-500"
                : "border-indigo-300"
            }`}
          />
          <button
            className="btn btn-primary absolute top-0 right-0 rounded-s-none text-2xl p-2"
            type="submit"
            onClick={addTask}
          >
            <FaArrowRightLong />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-primary w-2/3 block mx-auto text-xl"
        >
          create
        </button>
      </form>
      {ListsData.length < 1 ? (
        <div className="h-[50vh] flex items-center justify-center">
          <h3 className="text-center text-2xl ">
            Please creat a new To-Do List
          </h3>
        </div>
      ) : search === "" || createToDoList ? (
        <div className="flex gap-4 flex-wrap">
          {ListsData!.map((list: ToDoListType) => (
            <ListWindow
              key={list.listId}
              listId={list.listId}
              listName={list.listName}
              date={list.date}
              tasks={list.tasks}
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 flex-wrap">
          {ListsData!
            .filter((list: ToDoListType) => list.listName.includes(search))
            .map((list: ToDoListType) => (
              <ListWindow
                key={list.listId}
                listId={list.listId}
                listName={list.listName}
                date={list.date}
                tasks={list.tasks}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default Home;
