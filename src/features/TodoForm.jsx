import { useRef } from 'react';
import { useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';

function TodoForm({ onAddTodo, isSaving, setIsSaving }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState(''); //input title

  const todoTitleInput = useRef(null);

  function handleAddTodo(event) {
    event.preventDefault();
    //console.dir(event.target.title); // prevent refreshing

    onAddTodo({
      title: workingTodoTitle,
      isCompleted: false,
    });
    setWorkingTodoTitle(''); //clean input after entering task

    todoTitleInput.current.focus(); //focus the input again, for fast typing
  }

  return (
    //task added
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        ref={todoTitleInput}
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
        elementId="todoTitle"
        label="Todo"
      />

      <button type="submit" disabled={workingTodoTitle.trim() === ''}>
        {isSaving ? 'Saving...' : 'Add Todo'}
      </button>
    </form>
  );
}

export default TodoForm;
