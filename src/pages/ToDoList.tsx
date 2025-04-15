import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import { MdCheckCircle, MdEdit } from "react-icons/md";
import { FaTrashCan, FaXmark } from "react-icons/fa6";
import { RiPlayListAddFill } from "react-icons/ri";

// Task and List types
interface TaskType {
  taskName: string;
  completed: boolean;
}
interface ToDoListType {
  listId: number;
  listName: string;
  done: boolean;
  tasks: TaskType[];
}

const ToDoList = () => {
  const navigate = useNavigate();
  const { listId } = useParams();
  const userEmail = useSelector((state: RootState) => state.user.userEmail);

  // Load the selected list from localStorage
  const toDoLists = JSON.parse(
    localStorage.getItem(userEmail)!
  ) as ToDoListType[];
  const toDoList = toDoLists.find((list) => list.listId == Number(listId));

  const [form, setForm] = useState(toDoList!);
  const [save, setSave] = useState(false);
  const [addingTask, setAddingTask] = useState(false);
  const [addTaskText, setAddTaskText] = useState<string>("");
  const [editTaskText, setEditTaskText] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const tasks = form.tasks;
  const tasksDoneCount = tasks.filter((task) => task.completed == true).length;

  const totalCount = tasks.length;

  const progressPercent = ((tasksDoneCount * 100) / totalCount).toFixed(0);
  useEffect(() => {
    if (+progressPercent == 100) {
      setForm({ ...form, done: true });
    } else {
      setForm({ ...form, done: false });
    }
  }, [progressPercent]);

  const listEdit = () => {
    const updatedLists = toDoLists.map((list) =>
      list.listId === form.listId ? form : list
    );
    localStorage.setItem(userEmail, JSON.stringify(updatedLists));
    setSave(true);
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const addTaskFun = () => {
    const updateTasks = [...tasks, { taskName: addTaskText, completed: false }];

    setForm({ ...form, tasks: updateTasks });
    setAddTaskText("");
  };

  const toggleComplete = (index: number) => {
    const updated = [...form.tasks];
    updated[index].completed = !updated[index].completed;
    setForm({ ...form, tasks: updated });
  };

  const editTask = (index: number) => {
    const updateTasks = tasks.map((task, i) =>
      i === index ? { ...task, taskName: editTaskText } : task
    );
    setForm({ ...form, tasks: updateTasks });
  };

  const deleteTask = (index: number) => {
    const updated = form.tasks.filter((_, i) => i !== index);
    setForm({ ...form, tasks: updated });
  };

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleKeyDown = (e: KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;

    if ((isMac ? e.metaKey : e.ctrlKey) && e.key === "n") {
      e.preventDefault();
      addTaskFun();
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev === null ? 0 : prev + 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev === null ? 0 : Math.max(prev - 1, 0)));
    }

    if (e.key === " " && selectedIndex !== null) {
      e.preventDefault();
      toggleComplete(selectedIndex);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{toDoList!.listName}</h2>
        <label className="fieldset-label w-fit">
          <input
            type="checkbox"
            checked={form.done}
            className="checkbox checkbox-primary"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const allTasks = [...form.tasks];
              if (e.target.checked) {
                const updateTask = allTasks.map((task) => ({
                  ...task,
                  completed: true,
                }));
                setForm({ ...form, done: e.target.checked, tasks: updateTask });
              } else {
                const updateTask = allTasks.map((task) => ({
                  ...task,
                  completed: false,
                }));
                setForm({ ...form, done: e.target.checked, tasks: updateTask });
              }
            }}
          />
          <p className="text-slate-700 dark:text-indigo-200">Done</p>
        </label>
      </div>
      <progress
        className={`progress transition-all progress-primary dark:bg-primary-content w-full ${
          Number(progressPercent) == 100 ? "animate-bounce" : "animate-pulse"
        } `}
        value={progressPercent}
        max="100"
      ></progress>
      <ul className="w-1/2 max-w-lg">
        {tasks.map((task, index) => (
          <li key={index} className="my-4 flex items-center gap-4">
            <button
              className="btn btn-outline btn-error btn-sm text-xl px-1 rounded-lg"
              onClick={() => deleteTask(index)}
            >
              <FaTrashCan />
            </button>
            <button
              className="btn btn-outline btn-success btn-sm text-xl px-1 rounded-lg"
              onClick={() => {
                setEditIndex(index);
                setEditTaskText(task.taskName);
              }}
            >
              <MdEdit />
            </button>
            {index == editIndex ? (
              <div className="relative w-full">
                <input
                  type="text"
                  className="input input-primary w-full"
                  value={editTaskText}
                  placeholder="Edit Task"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditTaskText(e.target.value)
                  }
                />
                <div className=" absolute right-0 top-0">
                  <button
                    className="btn btn-primary px-2 rounded-none"
                    type="submit"
                    onClick={() => editTask(index)}
                  >
                    edited
                  </button>
                  <button
                    className="btn btn-error px-2 rounded-s-none"
                    type="submit"
                    onClick={() => {
                      setEditIndex(null);
                    }}
                  >
                    <FaXmark />
                  </button>
                </div>
              </div>
            ) : (
              <label className="fieldset-label w-fit ">
                <input
                  type="checkbox"
                  checked={form.tasks[index]?.completed}
                  className="checkbox checkbox-primary"
                  onChange={() => toggleComplete(index)}
                />
                <p className="text-slate-700 dark:text-indigo-200">
                  {task.taskName}
                </p>
              </label>
            )}
          </li>
        ))}
        {addingTask ? (
          <div className="relative w-full my-2">
            <input
              type="text"
              className="input w-full input-primary"
              value={addTaskText}
              placeholder="Add Task"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAddTaskText(e.target.value)
              }
            />
            <div className="absolute right-0 top-0">
              <button
                className="btn btn-primary px-2 rounded-none"
                type="submit"
                onClick={addTaskFun}
              >
                Add it
              </button>
              <button
                className="btn btn-error px-2 rounded-s-none"
                type="submit"
                onClick={() => {
                  setAddTaskText("");
                  setAddingTask(false);
                }}
              >
                <FaXmark />
              </button>
            </div>
          </div>
        ) : (
          <li
            onClick={() => setAddingTask(true)}
            className="w-fit rounded-lg flex items-center gap-3 px-3 my-2 btn bg-blue-600 text-white hover:bg-blue-700"
          >
            <RiPlayListAddFill className="text-xl" /> Add Task
          </li>
        )}
      </ul>
      <div className="flex justify-center items-center gap-2">
        <button onClick={listEdit} className="btn btn-primary text-lg">
          Save
        </button>
        <MdCheckCircle
          className={`text-3xl text-green-700 animate-bounce ${
            save ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </div>
  );
};

export default ToDoList;
