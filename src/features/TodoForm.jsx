import { useRef } from 'react';
import { useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';
import styled from 'styled-components';

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 50px;
`;

const StyledButton = styled.button`
  font-style: ${(props) => (props.disabled ? 'italic' : 'normal')};
`;

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
    <StyledForm onSubmit={handleAddTodo}>
      <TextInputWithLabel
        ref={todoTitleInput}
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
        elementId="todoTitle"
        // label="Todo"
      />

      <StyledButton type="submit" disabled={workingTodoTitle.trim() === ''}>
        {isSaving ? 'Saving...' : 'Add Todo'}
      </StyledButton>
    </StyledForm>
  );
}

export default TodoForm;
