import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
};

export default function TodoList({ user }: { user: any }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) setTodos(data);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTaskTitle.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ title: newTaskTitle, user_id: user.id }])
        .select();
      
      if (error) throw error;
      
      if (data) {
        setTodos([...data, ...todos]);
        setNewTaskTitle('');
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const toggleTodoCompleted = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      setTodos(
        todos.map((todo) => {
          if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
          }
          return todo;
        })
      );
    } catch (error: any) {
      alert(error.message);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      
      <form onSubmit={addTodo} className="flex mb-6">
              <input
          type="text"
          placeholder="Add a new task"
          value={newTaskTitle} // This should always be a string, not undefined
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add
        </button>
      </form>

      {loading ? (
        <p className="text-center">Loading todos...</p>
      ) : (
        <ul className="space-y-2">
          {todos.length ? (
            todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm border border-gray-200"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodoCompleted(todo.id, todo.completed)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span
                    className={`ml-2 ${
                      todo.completed ? 'line-through text-gray-500' : ''
                    }`}
                  >
                    {todo.title}
                  </span>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">No todos yet. Add one above!</p>
          )}
        </ul>
      )}
      
      <button
        onClick={() => supabase.auth.signOut()}
        className="mt-6 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        Sign Out
      </button>
    </div>
  );
}