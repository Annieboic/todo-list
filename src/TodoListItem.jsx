function TodoListItem({ todo, onCompleteTodo }) {
  return (
    <li>
      <form>
        <input //input for checkbox
          type="checkbox"
          checked={todo.isCompleted}
          onChange={() => onCompleteTodo(todo.id)}
        />
        {todo.title}
      </form>
    </li>
  );
}

export default TodoListItem;
