import { ChangeEvent } from "react";
import { IoCloseSharp } from "react-icons/io5";

interface HomeHeaderProps {
  createToDoList: boolean;
  search: string;
  setSearch: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
  setCreateToDoList: (value: boolean) => void;
}

const HomeHeader = ({
  createToDoList,
  search,
  setSearch,
  sortOrder,
  setSortOrder,
  setCreateToDoList,
}: HomeHeaderProps) => {
  return (
    <div className="w-full flex sm:flex-row flex-col justify-between items-center gap-2">
      <h2 className="text-3xl font-semibold whitespace-nowrap">All To-Dos</h2>

      <div className="flex sm:flex-row flex-col-reverse items-center justify-center gap-2 w-full">
        {!createToDoList && (
          <label className="floating-label text-primary sm:flex-1/4 w-full">
            <span>Search by List Name</span>
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
        <div
          className={`flex items-center gap-2 ${
            createToDoList && "sm:w-full sm:justify-end"
          }`}
        >
          <select
            id="sortSec"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="select select-primary my-2 sm:w-24 w-32 bg-indigo-400 dark:text-black text-center"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A–Z</option>
            <option value="za">Z–A</option>
          </select>
          <button
            onClick={() => setCreateToDoList(!createToDoList)}
            className={`btn btn-primary block my-2 sm:w-fit ${
              createToDoList ? "w-20" : "w-32"
            }`}
          >
            {createToDoList ? (
              <IoCloseSharp className={`text-2xl ${
              createToDoList ? "mx-auto" : "-mx-2"
            }`} />
            ) : (
              "New List"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeHeader;
