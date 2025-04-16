import { ChangeEvent, FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import ListWindow from "../componentes/ListWindow";
import { FaArrowRightLong } from "react-icons/fa6";

interface TaskType {
  taskId: number;
  taskName: string;
  completed: boolean;
}
interface ToDoListType {
  listId: number;
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

  // Form state for new list
  const [form, setForm] = useState<ToDoListType>({
    listId: 0,
    listName: "",
    icon: "",
    date: "",
    done: false,
    tasks: [],
  });

  const [newTask, setNewTask] = useState("");
  const [validate, setValidate] = useState(false);
  const [sortOrder, setSortOrder] = useState("latest");

  const addTask = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (newTask == "") return;

    setNewTask("");
    setForm({
      ...form,
      tasks: [
        ...form.tasks,
        {
          taskId: form.tasks.length + 1 || 1,
          taskName: newTask,
          completed: false,
        },
      ],
    });
  };

  // Submit and save new to-do list
  const createList = (e: FormEvent<HTMLElement>) => {
    e.preventDefault();

    if (form.listName == "" || form.tasks.length < 1) {
      setValidate(true);
      return;
    }

    setCreateToDoList(false);
    setValidate(false);

    const prevData = JSON.parse(localStorage.getItem(userEmail) || "[]");

    const oldDataList = prevData || [];

    const date = new Date().toLocaleDateString("en-US");

    const newList = {
      ...form,
      date: date,
    };

    const newDataLists = [...oldDataList, newList];
    localStorage.setItem(userEmail, JSON.stringify(newDataLists));

    // Reset form after creating the list
    setForm({
      listId: 0,
      listName: "",
      icon: "",
      date: "",
      done: false,
      tasks: [],
    });
  };

  // Sort lists based on user selection
  const sortedLists = [...ListsData].sort((a, b) => {
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

  return (
    <div className="min-h-[77vh]">
      {/* Header and search/sort controls */}
      <div className="w-full flex justify-between items-center">
        <h2 className="text-3xl font-semibold">All To-Dos</h2>

        {!createToDoList && (
          <label className="floating-label mt-4 text-primary flex-1/4 mx-2 max-w-1/2">
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
        <div className="flex items-center justify-center gap-2">
          <label htmlFor="sortSec">Sort by:</label>
          <select
            id="sortSec"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="select select-primary my-2 w-24 bg-indigo-400 dark:text-black"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A–Z</option>
            <option value="za">Z–A</option>
          </select>
          <button
            onClick={() => setCreateToDoList(!createToDoList)}
            className="btn btn-primary block my-2"
          >
            New List
          </button>
        </div>
      </div>

      {/* Form for creating a new list */}
      <form
        onSubmit={createList}
        className={`w-2/3 p-2 mx-auto mb-5 transition-all ${
          createToDoList
            ? "scale-100 max-h-[230px] overflow-y-auto"
            : "scale-95 max-h-0 overflow-hidden"
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

          {/* File input for list icon */}
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered file-input-primary w-1/3 cursor-pointer my-2"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setForm({
                    ...form,
                    icon: reader.result as string,
                  });
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>

        {/* Display added tasks */}
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

        {/* Input to add new task */}
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

      {/* Conditional rendering of lists */}
      {sortedLists.length < 1 ? (
        <div className="h-[50vh] flex items-center justify-center">
          <h3 className="text-center text-2xl ">
            Please creat a new To-Do List
          </h3>
        </div>
      ) : search === "" || createToDoList ? (
        <div className="flex gap-4 flex-wrap items-center justify-start">
          {sortedLists!.map((list: ToDoListType) => (
            <ListWindow
              key={list.listId}
              listId={list.listId}
              listName={list.listName}
              icon={list.icon}
              date={list.date}
              tasks={list.tasks}
              done={list.done}
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 flex-wrap items-center justify-start">
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
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default Home;
