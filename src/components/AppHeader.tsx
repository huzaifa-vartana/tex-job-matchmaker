
import { MoveUpRight } from 'lucide-react';

export const AppHeader = () => {
  return (
    <header className="bg-resume text-white shadow-md">
      <div className="container mx-auto py-4 px-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">TeX Job Matchmaker</h1>
        </div>
        <div>
          <a 
            href="https://github.com/your-project" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-sm hover:text-resume-light transition-colors"
          >
            <span>GitHub</span>
            <MoveUpRight size={14} className="ml-1" />
          </a>
        </div>
      </div>
    </header>
  );
};
