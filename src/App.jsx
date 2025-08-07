import './App.css';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import { useState } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);

  function onAddTodo(title) {
    const newTodo = {
      id: Date.now(),
      title: title,
      isCompleted: false,
    };
    setTodoList([...todoList, newTodo]);
  }

  function completeTodo(id) {
    const updatedTodos = todoList.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: true } : todo
    );
    setTodoList(updatedTodos);
  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={onAddTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} />
    </div>
  );
}

export default App;
