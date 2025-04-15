import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import { MdCheckCircle } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaTrashCan } from "react-icons/fa6";
import { RiPlayListAddFill } from "react-icons/ri";
import { FaXmark } from "react-icons/fa6";

const ToDoList = () => {
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

  const nanigate = useNavigate();
  const { listId } = useParams();
  const userEmail = useSelector((state: RootState) => state.user.userEmail);

  const toDoLists = JSON.parse(
    localStorage.getItem(userEmail)!
  ) as ToDoListType[];
  const toDoList = toDoLists.find((list) => list.listId == Number(listId));

  const [form, setForm] = useState(toDoList!);
  const [save, setSave] = useState(false);
  const [addingTask, setAddingTask] = useState(false);
  const [addTask, setAddTask] = useState<string>("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editTask, setEditTask] = useState("");

  const tasks = form.tasks;
  const tasksDoneCount = tasks.filter((task) => task.completed == true).length;

  const totalCount = tasks.length;

  const resolt = ((tasksDoneCount * 100) / totalCount).toFixed(0);
  useEffect(() => {
    if (+resolt == 100) {
      setForm({ ...form, done: true });
    } else {
      setForm({ ...form, done: false });
    }
  }, [form.tasks]);

  const listEdit = () => {
    const updatedLists = toDoLists.map((list) =>
      list.listId === form.listId ? form : list
    );
    localStorage.setItem(userEmail, JSON.stringify(updatedLists));
    setSave(true);
    setTimeout(() => {
      nanigate("/");
    }, 1000);
  };

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
          Number(resolt) == 100 ? "animate-bounce" : "animate-pulse"
        } `}
        value={resolt}
        max="100"
      ></progress>
      <ul className="w-1/2 max-w-lg">
        {tasks.map((task, index) => (
          <li key={index} className="my-4 flex items-center gap-4">
            <button
              className="btn btn-outline btn-error btn-sm text-xl px-1 rounded-lg"
              onClick={() => {
                const updateTask = tasks.filter((_, i) => i !== index);
                setForm({ ...form, tasks: updateTask });
              }}
            >
              <FaTrashCan />
            </button>
            <button
              className="btn btn-outline btn-success btn-sm text-xl px-1 rounded-lg"
              onClick={() => {
                setEditIndex(index);
                setEditTask(task.taskName);
              }}
            >
              <MdEdit />
            </button>
            {index == editIndex ? (
              <div className="relative w-full">
                <input
                  type="text"
                  className="input input-primary w-full"
                  value={editTask}
                  placeholder="Edit Task"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditTask(e.target.value)
                  }
                />
                <div className=" absolute right-0 top-0">
                  <button
                    className="btn btn-primary px-2 rounded-none"
                    type="submit"
                    onClick={() => {
                      const updateTasks = tasks.map((task, i) =>
                        i === index ? { ...task, taskName: editTask } : task
                      );
                      setForm({ ...form, tasks: updateTasks });
                      setEditIndex(null);
                    }}
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
              <label className="fieldset-label w-fit">
                <input
                  type="checkbox"
                  checked={form.tasks[index]?.completed}
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
            )}
          </li>
        ))}
        {addingTask ? (
          <div className="relative w-full my-2">
            <input
              type="text"
              className="input w-full input-primary"
              value={addTask}
              placeholder="Add Task"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAddTask(e.target.value)
              }
            />
            <div className="absolute right-0 top-0">
              <button
                className="btn btn-primary px-2 rounded-none"
                type="submit"
                onClick={() => {
                  const updateTasks = [
                    ...tasks,
                    { taskName: addTask, completed: false },
                  ];

                  setForm({ ...form, tasks: updateTasks });
                  setAddTask("");
                }}
              >
                Add it
              </button>
              <button
                className="btn btn-error px-2 rounded-s-none"
                type="submit"
                onClick={() => {
                  setAddTask("");
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
