import styles from './App.module.css';
import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import { useEffect, useState, useReducer } from 'react';
import TodosViewForm from './features/TodosViewForm';

import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';

function encodeUrl({ sortField, sortDirection, queryString }) {
  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  let searchQuery = '';
  let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
  if (queryString) {
    searchQuery = `&filterByFormula=SEARCH(LOWER("${queryString}"),LOWER(+title))`;
  }
  return encodeURI(`${url}?${sortQuery}${searchQuery}`);
}

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

  //Sorting/Filtering
  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      const url = encodeUrl({ sortField, sortDirection, queryString });
      const token = `Bearer ${import.meta.env.VITE_PAT}`;

      dispatch({ type: todoActions.fetchTodos });

      try {
        const resp = await fetch(url, {
          method: 'GET',
          headers: { Authorization: token },
        });

        if (!resp.ok) {
          throw new Error(
            `Request failed with status ${resp.status}: ${resp.statusText}`
          );
        }

        const data = await resp.json();
        dispatch({
          type: todoActions.loadTodos,
          records: data.records,
        });
      } catch (error) {
        dispatch({
          type: todoActions.setLoadError,
          error,
        });
      }
    };

    fetchTodos();
  }, [sortField, sortDirection, queryString]);

  //POST request
  //user sees the message that is is saving / can not add again
  //response got back -> got created todo and add it to the array
  //isSubmitting to false
  const onAddTodo = async (newTodo) => {
    const url = encodeUrl({ sortField, sortDirection, queryString });
    const token = `Bearer ${import.meta.env.VITE_PAT}`;

    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: newTodo.isCompleted,
          },
        },
      ],
    };

    dispatch({ type: todoActions.startRequest });

    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        throw new Error(
          `Request failed with status ${resp.status}: ${resp.statusText}`
        );
      }

      const { records } = await resp.json();

      dispatch({
        type: todoActions.addTodo,
        record: records[0],
      });
    } catch (error) {
      dispatch({
        type: todoActions.setLoadError,
        error,
      });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  const updateTodo = async (editedTodo) => {
    const url = encodeUrl({ sortField, sortDirection, queryString });
    const token = `Bearer ${import.meta.env.VITE_PAT}`;

    const originalTodo = todoState.todoList.find(
      (todo) => todo.id === editedTodo.id
    );

    dispatch({
      type: todoActions.updateTodo,
      editedTodo,
    });

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    try {
      const resp = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        throw new Error(
          `Request failed with status ${resp.status}: ${resp.statusText}`
        );
      }
    } catch (error) {
      dispatch({
        type: todoActions.revertTodo,
        editedTodo: originalTodo,
        error,
      });
    }
  };

  //save the current version of todo(if request fails)
  //send request PATCH with isCompleted- changed
  // if failed request - revert UI to setTodoList
  const completeTodo = async (id) => {
    const url = encodeUrl({ sortField, sortDirection, queryString });
    const token = `Bearer ${import.meta.env.VITE_PAT}`;
    const originalTodo = todoState.todoList.find((todo) => todo.id === id);

    dispatch({
      type: todoActions.completeTodo,
      id,
    });

    const payload = {
      records: [
        {
          id: id,
          fields: {
            title: originalTodo.title,
            isCompleted: true,
          },
        },
      ],
    };

    try {
      const resp = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        throw new Error(
          `Request failed with status ${resp.status}: ${resp.statusText}`
        );
      }
    } catch (error) {
      dispatch({
        type: todoActions.revertTodo,
        editedTodo: originalTodo,
        error,
      });
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <div className={styles.app}>
        <TodoForm onAddTodo={onAddTodo} isSaving={todoState.isSaving} />

        <TodoList
          todoList={todoState.todoList}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
          isLoading={todoState.isLoading}
        />
      </div>

      <hr />
      <TodosViewForm
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        setQueryString={setQueryString}
        queryString={queryString}
      />

      {todoState.errorMessage && (
        <div className={styles.errorMessage}>
          <hr />
          <p>{todoState.errorMessage}</p>
          <button onClick={() => dispatch({ type: todoActions.clearError })}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
