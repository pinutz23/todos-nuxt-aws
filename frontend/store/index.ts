import Vue from 'vue'
import { getAccessorType } from 'typed-vuex'
import {ActionTree, GetterTree, MutationTree} from 'vuex'
import {MutationTypes} from "~/types/mutation-types";
import {ActionTypes} from "~/types/action-types";
import {GetterTypes} from "~/types/getter-types";

interface NewTodo {
    todo: string
}

export interface Todo extends NewTodo {
    id: string
    isComplete: boolean
}

export interface TodoState {
    todos: Todo[]
}

export const state = (): TodoState => ({
    todos: []
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
    [GetterTypes.GET_TODOS]: (state: TodoState) => state.todos
}


export const mutations: MutationTree<RootState> = {
    [MutationTypes.SET_TODOS]: (state, todos: Todo[]) => Vue.set(state, 'todos', todos),
    [MutationTypes.ADD_TODO]: (state, todo: Todo) => Vue.set(state, 'todos', [...state.todos, todo]),
    [MutationTypes.DELETE_TODO]: (state, todoId: string) => Vue.set(state, 'todos', state.todos.filter(t => t.id !== todoId)),
    [MutationTypes.TOGGLE_TODO]: (state, todoId: string) => Vue.set(state, 'todos', state.todos.map(t => {
        if (t.id === todoId) {
            return {...t, isComplete: !t.isComplete}
        }
        return t
    }))
}

export const actions: ActionTree<RootState, RootState> = {
    async nuxtServerInit({commit}) {
        const todos = await this.$axios.$get("todos")
        commit(MutationTypes.SET_TODOS, todos)
    },
    async [ActionTypes.ADD_TODO]({commit}, todo: NewTodo) {
        const response = await this.$axios.post("todos", todo)
        commit(MutationTypes.ADD_TODO, response.data)
    },
    async [ActionTypes.DELETE_TODO]({commit}, todoId: string) {
        const config = {
            headers: {'Content-Type': 'application/json'},
            data: {id: todoId}
        }
        const response = await this.$axios.delete(`todos/${todoId}`, config)
        commit(MutationTypes.DELETE_TODO, response.data.id)
    },
    async [ActionTypes.TOGGLE_TODO]({commit}, todo: Todo) {
        const response = await this.$axios.post(`todos/${todo.id}`, {isComplete: !todo.isComplete})
        commit(MutationTypes.TOGGLE_TODO, response.data.id)
    },
}

// This compiles to nothing and only serves to return the correct type of the accessor
export const accessorType = getAccessorType({
    state,
    getters,
    mutations,
    actions,
})