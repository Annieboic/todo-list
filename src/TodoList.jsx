import TodoListItem from './TodoListItem';

const todos = [
  { id: 1, title: 'review resources' },
  { id: 2, title: 'take notes' },
  { id: 3, title: 'code out app' },
];

function TodoList() {
  return (
    <div>
      {todos.map((todo) => (
        <TodoListItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}

export default TodoList;
