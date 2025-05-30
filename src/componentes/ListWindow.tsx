import { Link } from "react-router-dom";

// Task and List types
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

const ListWindow = ({ listId, listName, icon, date, tasks }: ToDoListType) => {
  // Calculate the progress percentage based on completed tasks
  const tasksDoneCount = tasks.filter((task) => task.completed == true).length;
  const totalCount = tasks.length;
  const progressPercent = ((tasksDoneCount * 100) / totalCount).toFixed(0);

  return (
    <Link
      to={`/list/${listId}`}
      className="bg-indigo-200 dark:border-indigo-300 dark:bg-indigo-800 rounded-md cursor-pointer border border-primary p-4 pb-2 scale-95 hover:scale-100 transition-all w-70 h-44 shadow-md shadow-indigo-300 dark:shadow-indigo-900 hover:shadow-lg hover:shadow-indigo-500 dark:hover:shadow-indigo-700"
    >
      {/* Top section: Icon and progress circle */}
      <div
        className={`flex h-26 ${
          icon ? `justify-around` : "justify-center"
        } items-center mb-4 gap-2`}
      >
        {icon && (
          <div className="flex justify-center items-center rounded-xl w-30 overflow-hidden ">
            <img src={icon} alt={`${listName} icon`} className="w-full" />
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
      </div>
    </Link>
  );
};

export default ListWindow;
