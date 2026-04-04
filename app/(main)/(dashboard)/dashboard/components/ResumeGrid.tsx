import ResumeCard from "./ResumeCard";
import EmptyState from "./EmptyState";

import { ResumeListItem } from "@/features/resume/services/resume-service";

interface GridProps {
  resumes: ResumeListItem[];
  onDelete: (id: string) => void;
  onCreate: () => void;
}

const ResumeGrid = ({ resumes, onDelete, onCreate }: GridProps) => {
  if (resumes.length === 0) {
    return <EmptyState onCreate={onCreate} />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {resumes.map((resume) => (
        <ResumeCard
          key={resume.id}
          resume={resume}
          onDelete={() => onDelete(resume.id)}
        />
      ))}
    </div>
  );
};

export default ResumeGrid;
