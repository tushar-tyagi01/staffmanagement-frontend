import React from 'react';
import { FolderOpen } from 'lucide-react';

const EmptyState = ({ title, description, icon: Icon = FolderOpen, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
      <div className="bg-indigo-50 dark:bg-gray-800/50 rounded-full p-4 mb-4">
        <Icon className="h-10 w-10 text-indigo-500 dark:text-indigo-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
