import { useRef } from 'react';
import { useState } from 'react';

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState(''); //input title

  const todoTitleInput = useRef(null);

  function handleAddTodo(event) {
    event.preventDefault();
    //console.dir(event.target.title);

    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle('');

    todoTitleInput.current.focus(); //focus the input again, for fast typing
  }

  return (
    //task added
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        type="text"
        id="todoTitle"
        name="title"
        ref={todoTitleInput}
        value={workingTodoTitle} //Connect Form Input to Component State
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
      />
      <button type="submit" disabled={workingTodoTitle.trim() === ''}>
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;
