import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdCheckCircle, MdEdit } from "react-icons/md";
import { FaTrashCan, FaXmark } from "react-icons/fa6";
import { RiPlayListAddFill } from "react-icons/ri";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { RootState } from "../redux/store";

// Task and List types
interface TaskType {
  taskId: number;
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

const ToDoList = () => {
  const navigate = useNavigate();
  const { listId } = useParams();
  const userEmail = useSelector((state: RootState) => state.user.userEmail);

  // Load the selected list from localStorage
  const toDoLists = JSON.parse(
    localStorage.getItem(userEmail)!
  ) as ToDoListType[];
  const toDoList = toDoLists.find((list) => list.listId == listId);

  //state variables
  const [form, setForm] = useState(toDoList!);
  const [save, setSave] = useState(false);
  const [addingTask, setAddingTask] = useState(false);
  const [addTaskText, setAddTaskText] = useState<string>("");
  const [editTaskText, setEditTaskText] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Calculate progress percentage
  const tasks = form.tasks;
  const tasksDoneCount = tasks.filter((task) => task.completed == true).length;
  const totalCount = tasks.length;
  const progressPercent = ((tasksDoneCount * 100) / totalCount).toFixed(0);

  // Automatically update done ToDo list based on task completion
  useEffect(() => {
    setForm({ ...form, done: +progressPercent === 100 });
  }, [progressPercent]);

  // Save the list changes
  const saveListEdits = () => {
    const updatedLists = toDoLists.map((list) =>
      list.listId === form.listId ? form : list
    );
    localStorage.setItem(userEmail, JSON.stringify(updatedLists));
    setSave(true);
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  // keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    // this code mabe not work in some browsers because of security/user-experience issue reasons
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    if ((isMac ? e.metaKey : e.ctrlKey) && e.key === "n") {
      e.preventDefault();
      setAddingTask(true);
      addTaskFunction();
    }

    // Navigate task list with arrows
    if (e.key === "ArrowDown") {
      e.preventDefault();
      console.log(selectedIndex);
      setSelectedIndex((prev) =>
        prev === null ? 0 : Math.min(prev + 1, tasks.length - 1)
      );
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      console.log(selectedIndex);
      setSelectedIndex((prev) => (prev === null ? 0 : Math.max(prev - 1, 0)));
    }
    // Deselect with Escape
    if (e.key === "Escape" && selectedIndex !== null) {
      e.preventDefault();
      setSelectedIndex(null);
    }

    // Toggle task completion with Space
    if (e.key === " " && selectedIndex !== null) {
      e.preventDefault();
      toggleComplete(selectedIndex);
    }

    // Edit task with Enter or 'e'
    if ((e.key === "e" || e.key === "Enter") && selectedIndex !== null) {
      e.preventDefault();
      editTask(selectedIndex);
      setEditIndex(selectedIndex);
    }

    // Delete task with Delete key
    if (e.key === "Delete" && selectedIndex !== null) {
      e.preventDefault();
      deleteTask(selectedIndex);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  // Add new task to the list
  const addTaskFunction = () => {
    if (addTaskText.trim() === "") return;

    const updateTasks = [
      ...tasks,
      {
        taskId: tasks.length + 1 || 1,
        taskName: addTaskText,
        completed: false,
      },
    ];

    setForm({ ...form, tasks: updateTasks });
    setAddTaskText("");
    setAddingTask(false);
  };

  // Toggle completion status of a task
  const toggleComplete = (index: number) => {
    const updated = [...form.tasks];
    updated[index].completed = !updated[index].completed;
    setForm({ ...form, tasks: updated });
  };

  // Edit task name
  const editTask = (index: number) => {
    const updateTasks = tasks.map((task, i) =>
      i === index ? { ...task, taskName: editTaskText } : task
    );
    setForm({ ...form, tasks: updateTasks });
    setEditIndex(null);
  };

  // Delete task
  const deleteTask = (index: number) => {
    const updated = form.tasks.filter((_, i) => i !== index);
    setForm({ ...form, tasks: updated });
  };

  // Drag and Drop handlers
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reordered = Array.from(tasks);
    const [movedItem] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, movedItem);
    setForm({ ...form, tasks: reordered });
  };

  return (
    <div className="min-h-[75vh]">
      {/* Header List section with list name and completion toggle */}
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

      {/* Progress bar */}
      <progress
        className={`progress transition-all progress-primary dark:bg-primary-content w-full ${
          Number(progressPercent) == 100 ? "animate-bounce" : "animate-pulse"
        } `}
        value={progressPercent}
        max="100"
      ></progress>

      {/*  TODO: The task list UI  */}
      <div className="flex justify-between mb">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="taskList">
            {(provided) => (
              <ul
                className="w-1/2 max-w-lg"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {tasks.map((task, index) => (
                  <Draggable
                    key={task.taskId}
                    draggableId={String(task.taskId)}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={` ${
                          selectedIndex === index
                            ? "bg-indigo-200 dark:bg-indigo-900"
                            : ""
                        } p-2 my-4 flex items-center gap-4 cursor-move transition-all duration-150 ease-in-out ${
                          snapshot.isDragging
                            ? "bg-indigo-200 dark:bg-indigo-900 shadow-xl scale-[1.02]"
                            : ""
                        }`}
                      >
                        {/* Delete Task*/}
                        <button
                          className="btn btn-outline btn-error btn-sm text-xl px-1 rounded-lg"
                          onClick={() => deleteTask(index)}
                        >
                          <FaTrashCan />
                        </button>

                        {/* Edit Task*/}
                        <button
                          className="btn btn-outline btn-success btn-sm text-xl px-1 rounded-lg"
                          onClick={() => {
                            setEditIndex(index);
                            setEditTaskText(task.taskName);
                          }}
                        >
                          <MdEdit />
                        </button>

                        {/* Edit Input */}
                        {index == editIndex ? (
                          <div className="relative w-full">
                            <input
                              type="text"
                              className="input input-primary w-full"
                              value={editTaskText}
                              placeholder="Edit Task"
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => setEditTaskText(e.target.value)}
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
                          // Task Item
                          <label className={`fieldset-label w-fit`}>
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
                    )}
                  </Draggable>
                ))}

                {/* Add Task Section */}
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
                        onClick={addTaskFunction}
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
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        {form.icon ? (
          <div className="w-100 h-100 rounded-xl max-w-lg my-4 overflow-hidden relative">
            <img
              src={form.icon}
              alt="List Icon"
              className="w-full rounded-xl"
            />
            <label
              htmlFor="iconInput"
              className="btn btn-outline btn-primary w-full cursor-pointer my-2"
            >
              Change List Icon
            </label>
            <input
              type="file"
              id="iconInput"
              accept="image/*"
              className="hidden"
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
        ) : (
          <div>
            <label
              htmlFor="iconInput"
              className="btn btn-outline btn-primary w-full cursor-pointer my-2"
            >
              Choose List Icon
            </label>
            <input
              type="file"
              id="iconInput"
              accept="image/*"
              className="hidden"
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
        )}
      </div>

      {/* Save List changes Button */}
      <div className="flex justify-center items-center gap-2">
        <button onClick={saveListEdits} className="btn btn-primary text-lg">
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
