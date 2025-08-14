import axios from "axios";
import { useEffect, useState } from "react";

interface qoutesResponse {
  id: string;
  quote: string;
  author: string;
}

const Quotes = () => {
  const [qoute, setQoute] = useState<string>("");
  const [qouteAuthor, setQouteAuthor] = useState<string>("");
  const path = location.pathname;

  const getData = async () => {
    try {
      const response = await axios.get<qoutesResponse>(
        "https://dummyjson.com/quotes/random"
      );

      setQoute(response.data.quote);
      setQouteAuthor(response.data.author);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, [path]);

  return (
    <div
      className="rounded-2xl px-6 py-4 bg-indigo-200 dark:bg-slate-900 w-full md:w-1/3"
      id="quotes"
    >
      <h3 className="text-indigo-700 font-bold text-center text-lg pb-2">
        Your Quote
      </h3>
      {qoute ? (
        <>
          <p className="text-teal-800 font-semibold my-2">{qoute}</p>
          <p className="text-teal-700 text-end font-bold">{qouteAuthor}</p>
        </>
      ) : (
        <div className="flex justify-center items-center h-16">
          <div className="w-6 h-6 border-b-2 border-s border-indigo-700 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default Quotes;
