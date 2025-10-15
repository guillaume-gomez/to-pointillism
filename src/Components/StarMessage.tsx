import StarButton from "./StarButton";

interface StarMessagePros {
  projectUrl: string;
  projectName: string;
}

function StarMessage({projectUrl, projectName} : StarMessagePros ) {
  return (
    <span className="text-xs pt-2 flex flex-col items-center gap-1">
        Did you enjoyed ? 😊 Star the project
        <StarButton 
          projectName={projectName}
          projectUrl={projectUrl}
        />
    </span>
  )
}

export default StarMessage;