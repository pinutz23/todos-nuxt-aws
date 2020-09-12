import {computed} from "@nuxtjs/composition-api";
import {GetterTypes} from "~/types/getter-types";
import {ActionTypes} from "~/types/action-types";
import {Todo} from "~/store";

// @ts-ignore
export const useTodos = store => {
    const allTodos = computed(() => store.getters[GetterTypes.GET_TODOS] as Todo[])
    const openTodos = computed(() => allTodos.value.filter(todo => !todo.isComplete))
    const doneTodos = computed(() => allTodos.value.filter(todo => todo.isComplete))

    const addTodo = (newTodo: string) => {
        store.dispatch(ActionTypes.ADD_TODO, {todo: newTodo})
    }

    const deleteTodo = (todoId: string) => {
        store.dispatch(ActionTypes.DELETE_TODO, todoId)
    }

    const toggleTodo = (todo: Todo) => {
        store.dispatch(ActionTypes.TOGGLE_TODO, todo)
    }

    return {
        allTodos,
        openTodos,
        doneTodos,
        addTodo,
        deleteTodo,
        toggleTodo
    }
}
