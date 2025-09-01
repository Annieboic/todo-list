import TodoListItem from './TodoListItem';

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  const filteredTodoList = todoList.filter(
    (todo) => todo.isCompleted === false
  ); //filtered to all not completed tasks

  return (
    <div>
      {isLoading ? (
        <p>Todo list loading...</p>
      ) : filteredTodoList.length < 1 ? (
        <p>Add todo above to get started</p> //no tasks - show paragraph
      ) : (
        <ul>
          {filteredTodoList.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              onCompleteTodo={onCompleteTodo}
              onUpdateTodo={onUpdateTodo}
            /> //or show filtered one
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoList;
