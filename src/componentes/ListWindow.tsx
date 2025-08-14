import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../redux/store";
import { FaTrashAlt } from "react-icons/fa";
import { Dispatch, SetStateAction } from "react";

// Task and List types
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
  setRender: Dispatch<SetStateAction<boolean>>;
}

const ListWindow = ({ listId, listName, icon, date, tasks, setRender }: ToDoListType) => {
  // Calculate the progress percentage based on completed tasks
  const tasksDoneCount = tasks.filter((task) => task.completed == true).length;
  const totalCount = tasks.length;
  const progressPercent = ((tasksDoneCount * 100) / totalCount).toFixed(0);
  const userEmail = useSelector((state: RootState) => state.user.userEmail);

  // Load the selected list from localStorage
  const toDoLists = JSON.parse(
    localStorage.getItem(userEmail)!
  ) as ToDoListType[];

  // Delete list from localStorage
  const deleteList = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation(); // يمنع وصول الحدث للأب
    e.preventDefault(); // يمنع الـ <Link> من تنفيذ الانتقال
    console.log("delete clicked");
    const updatedLists = toDoLists.filter((list) => list.listId !== id);
    localStorage.setItem(userEmail, JSON.stringify(updatedLists));
    setRender((prev) => !prev); // Trigger re-render
  };

  return (
    <Link
      to={`/list/${listId}`}
      className="p-4 pb-2 bg-indigo-200 dark:bg-indigo-800 rounded-md cursor-pointer border border-primary dark:border-indigo-300 scale-95 hover:scale-100 transition-all h-44 shadow-md shadow-indigo-300 dark:shadow-indigo-900 hover:shadow-lg hover:shadow-indigo-500 dark:hover:shadow-indigo-700"
    >
      {/* Top section: Icon and progress circle */}
      <div
        className={`flex h-26 ${
          icon ? `justify-around` : "justify-center"
        } items-center mb-4 gap-2`}
      >
        {icon && (
          <div
            className="flex justify-center items-center rounded-xl w-30 h-30 overflow-hidden bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${icon})` }}
          >
            {!icon && (
              <p>{listName} icon not found</p>
              // <img src={icon} alt={`${listName} icon`} className="w-full" />
            )}
          </div>
        )}
        <div
          className="radial-progress text-primary dark:text-primary-content"
          style={{ "--value": progressPercent } as React.CSSProperties}
          aria-valuenow={Number(progressPercent)}
          role="progressbar"
        >
          {progressPercent}%
        </div>
      </div>

      {/* Bottom section: List name and date */}
      <div className="flex justify-evenly items-center mt-2 ">
        <h2 className="font-semibold">{listName}</h2>
        <p className="text-center">{date}</p>
        <button
          className="cursor-pointer"
          onClick={(e) => deleteList(e, listId)}
        >
          <FaTrashAlt className="text-xl text-red-700 hover:scale-110 hover:text-red-500" />
        </button>
      </div>
    </Link>
  );
};

export default ListWindow;
