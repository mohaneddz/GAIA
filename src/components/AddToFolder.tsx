import { Folder } from "lucide-react";
import { useState, useEffect } from "react";
import { getCookie, setCookie } from "@/lib/cookies";
import { pageName } from "@/lib/pageNames";

interface AddToFolderProps {
  currentPage: string;
}

export default function AddToFolder({ currentPage }: AddToFolderProps) {
  const [addedPages, setAddedPages] = useState<string[]>([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    const stored = getCookie('addedPages');
    if (stored) {
      try {
        setAddedPages(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing cookie:', e);
      }
    }
  }, []);

  useEffect(() => {
    setCookie('addedPages', JSON.stringify(addedPages));
  }, [addedPages]);

  const isAdded = addedPages.includes(currentPage);

  const handleClick = () => {
    if (isAdded) {
      setAddedPages(addedPages.filter((page) => page !== currentPage));
    } else {
      setAddedPages([...addedPages, currentPage]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      {showList && addedPages.length > 0 && (
        <div className="absolute w-max bottom-full left-1/2 translate-x-[-50%] mb-2 right-0 bg-white border border-gray-300 rounded shadow-lg p-2 max-w-xs z-10">
          <ul className="list-disc list-inside text-sm">
            {addedPages.map((page, index) => (
              <li key={index}>{pageName(page)}</li>
            ))}
          </ul>
        </div>
      )}
      <div
        className="rounded-full bg-blue-600 text-white px-4 py-2 shadow-lg cursor-pointer hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200"
        onClick={handleClick}
        onMouseEnter={() => setShowList(true)}
        onMouseLeave={() => setShowList(false)}
      >
        <Folder className="w-4 h-4 mr-2 inline" />
        {isAdded ? "Remove from Folder" : "Add to Folder"}
      </div>
    </div>
  );
};
