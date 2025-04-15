import { Link } from "react-router-dom";

const ListWindow = ({
  listId,
  listName,
  date,
  tasks,
}: {
  listId: number;
  listName: string;
  date: string;
  tasks: {
    taskName: string;
    completed: boolean;
  }[];
}) => {
  const tasksDoneCount = tasks.filter((task) => task.completed == true).length;

  const totalCount = tasks.length;

  const resolt = ((tasksDoneCount * 100) / totalCount).toFixed(0);

  return (
    <Link
      to={`/list/${listId}`}
      className="bg-indigo-200 dark:border-indigo-300 dark:bg-indigo-800 rounded-md cursor-pointer border border-primary p-4 pb-2 scale-95 hover:scale-100 transition-all"
    >
      <div className="flex justify-between items-center gap-2">
        <h2 className="font-semibold">{listName}</h2>
        <div
          className="radial-progress text-primary dark:text-primary-content"
          style={{ "--value": resolt } as React.CSSProperties}
          aria-valuenow={Number(resolt)}
          role="progressbar"
        >
          {resolt}%
        </div>
      </div>
        <p className="text-center mt-2">{date}</p>
    </Link>
  );
};

export default ListWindow;
