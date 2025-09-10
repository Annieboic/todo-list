import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import { useEffect, useState } from 'react';
import TodosViewForm from './features/TodosViewForm';
import { useCallback } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  //Sorting/Filtering
  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');

  //Updating todos
  const [isSaving, setIsSaving] = useState(false);

  const encodeUrl = useCallback(() => {
    const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
    let searchQuery = '';
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH(LOWER("${queryString}"),LOWER(title))`;
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString]);

  useEffect(() => {
    const fetchTodos = async () => {
      const url = encodeUrl();
      const token = `Bearer ${import.meta.env.VITE_PAT}`;

      setIsLoading(true);

      const options = {
        method: 'GET',
        headers: { Authorization: token },
      };

      try {
        //fetch is called
        const resp = await fetch(url, options);
        //error message if false
        if (!resp.ok) {
          throw new Error(
            `Request failed with status ${resp.status}: ${resp.statusText}`
          );
        }
        // getting data and => json format
        const data = await resp.json();
        //extract records array
        const records = data.records;
        //map over each record from Airtable
        const todos = records.map((record) => {
          const todo = {
            id: record.id,
            title: record.fields.title || '',
            isCompleted: record.fields.isCompleted ? true : false,
          };

          return todo;
        });
        setTodoList([...todos]);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, [sortField, sortDirection, queryString]);
  //POST request
  //user sees the message that is is saving / can not add again
  //response got back -> got created todo and add it to the array
  //isSubmitting to false
  const onAddTodo = async (newTodo) => {
    const url = encodeUrl();
    const token = `Bearer ${import.meta.env.VITE_PAT}`;

    //created new task
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
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    //fetch(url, options)
    console.log('Adding todo:', newTodo);
    try {
      setIsSaving(true);

      //network request
      const resp = await fetch(url, options);
      console.log('Fetch response received:', resp);
      //error
      if (!resp.ok) {
        throw new Error(
          `Request failed with status ${resp.status}: ${resp.statusText}`
        );
      }
      //destructure records array from response
      const { records } = await resp.json();

      //extract the new todo from response
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };
      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }
      setTodoList([...todoList, savedTodo]);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateTodo = async (editedTodo) => {
    const url = encodeUrl();
    const token = `Bearer ${import.meta.env.VITE_PAT}`;

    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

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

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);
      const resp = await fetch(url, options);

      if (!resp.ok) {
        throw new Error(
          `Request failed with status ${resp.status}: ${resp.statusText}`
        );
      }
      const updatedTodos = todoList.map((todo) =>
        todo.id === editedTodo.id ? { ...todo, ...editedTodo } : todo
      );
      setTodoList(updatedTodos);
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);
    } finally {
      setIsSaving(false);
    }
  };

  //save the current version of todo(if request fails)
  //send request PATCH with isCompleted- changed
  // if failed request - revert UI to setTodoList
  const completeTodo = async (id) => {
    const url = encodeUrl();
    const token = `Bearer ${import.meta.env.VITE_PAT}`;

    const originalTodo = todoList.find((todo) => todo.id === id);

    const updatedCompletedTrue = { ...originalTodo, isCompleted: true };

    //update UI todo

    const updated = todoList.map((todo) =>
      todo.id === id ? updatedCompletedTrue : todo
    );

    setTodoList(updated);

    const payload = {
      records: [
        {
          id: updatedCompletedTrue.id,
          fields: {
            title: updatedCompletedTrue.title,
            isCompleted: updatedCompletedTrue.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error(
          `Request failed with status ${resp.status}: ${resp.statusText}`
        );
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);
      setTodoList((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? originalTodo : todo))
      );
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm
        onAddTodo={onAddTodo}
        isSaving={isSaving}
        setIsSaving={setIsSaving}
      />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />

      <hr />
      <TodosViewForm
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        setQueryString={setQueryString}
        queryString={queryString}
      />

      {errorMessage && (
        <div>
          <hr />
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage('')}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App;
