import {useState, useEffect} from "react";

interface StarButonProps {
 projectName: string;
 projectUrl: string;
}

function StarButton({projectName, projectUrl} : StarButonProps ) {
  const [star, setStar] = useState<number| null>(null);
  
  useEffect(() => {
    async function fetchData() {
      const reponse = await fetch(`https://api.github.com/repos/guillaume-gomez/${projectName}`)
      const githubData = await reponse.json();
      setStar(githubData.stargazers_count)
    }
    fetchData();
  }, [])
	return (
		<div className="join w-[120px]" onClick={() => window.open(projectUrl, "_blank") }>
      <button 
        type="button"
        className="join-item btn btn-xs text-black bg-white border-t border-b border-l rounded-l-md hover:bg-gray-100"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 1792 1792"
        >
          <path d="M1728 647q0 22-26 48l-363 354 86 500q1 7 1 20 0 21-10.5 35.5t-30.5 14.5q-19 0-40-12l-449-236-449 236q-22 12-40 12-21 0-31.5-14.5t-10.5-35.5q0-6 2-20l86-500-364-354q-25-27-25-48 0-37 56-46l502-73 225-455q19-41 49-41t49 41l225 455 502 73q56 9 56 46z">
          </path>
        </svg>
        Star
      </button>
      {star !== null &&
        <button
          type="button"
          className="join-item btn btn-xs text-black bg-white border rounded-r-md hover:bg-gray-100"
        >
          {star}
        </button>
      }
    </div>
	);
}

export default StarButton;