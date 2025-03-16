import React, { useState } from 'react';

const AddTaskInput: React.FC = () => {
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');

  return (
    <div className="flex items-center">
      <input
        type="text"
        placeholder="Add a new task"
        value={newTaskTitle} // This should always be a string, not undefined
        onChange={(e) => setNewTaskTitle(e.target.value)}
        className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
};

export default AddTaskInput;
