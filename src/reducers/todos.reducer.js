export const actions = {
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',
  setLoadError: 'setLoadError',
  startRequest: 'startRequest',
  addTodo: 'addTodo',
  endRequest: 'endRequest',
  updateTodo: 'updateTodo',
  completeTodo: 'completeTodo',
  revertTodo: 'revertTodo',
  clearError: 'clearError',
};

export const initialState = {
  todoList: [],
  isLoading: false,
  isSaving: false,
  errorMessage: '',
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.fetchTodos:
      return {
        ...state,
        isLoading: true,
      };

    case actions.loadTodos:
      return {
        ...state,
        todoList: action.records.map((record) => ({
          id: record.id,
          ...record.fields,
          isCompleted: record.fields.isCompleted ?? false,
        })),
        isLoading: false,
        errorMessage: '',
      };

    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.error.message,
        isLoading: false,
        isSaving: false,
      };

    case actions.startRequest:
      return {
        ...state,
        isSaving: true,
      };

    case actions.addTodo: {
      const savedTodo = {
        id: action.record.id,
        title: action.record.fields.title,
        isCompleted:
          action.record.fields.isCompleted !== undefined
            ? action.record.fields.isCompleted
            : false,
      };
      return {
        ...state,
        todoList: [...state.todoList, savedTodo],
        isSaving: false,
      };
    }

    case actions.endRequest:
      return {
        ...state,
        isLoading: false,
        isSaving: false,
      };

    // Optimistic UI: update and revert todo
    case actions.revertTodo:
    // fallthrough to updateTodo case
    case actions.updateTodo: {
      const updatedTodos = state.todoList.map((todo) =>
        todo.id === action.editedTodo.id ? action.editedTodo : todo
      );

      const updatedState = {
        ...state,
        todoList: updatedTodos,
      };

      if (action.error) {
        updatedState.errorMessage = action.error.message;
      }

      return updatedState;
    }

    // Optimistic UI: complete todo
    case actions.completeTodo: {
      const updatedTodos = state.todoList.map((todo) =>
        todo.id === action.id ? { ...todo, isCompleted: true } : todo
      );

      return {
        ...state,
        todoList: updatedTodos,
      };
    }

    // Dismiss error button clears error message
    case actions.clearError:
      return {
        ...state,
        errorMessage: '',
      };

    // Default returns current state unchanged
    default:
      return state;
  }
}
