<template>
  <div>
    <form class="flex flex-col md:flex-row" @submit.prevent="addTodo(state.newTodo); state.newTodo = ''">
      <input v-model="state.newTodo" type="text" placeholder="Learn Nuxt and AWS cdk"
             class="block flex-auto w-full px-4 py-3 text-base leading-6 appearance-none border border-gray-300 shadow-none bg-white rounded-md placeholder-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300">
      <button
          class="block relative mt-4 md:mt-0 md:ml-4 px-6 py-3 w-full md:w-auto border border-transparent whitespace-no-wrap text-base leading-6 font-semibold leading-snug bg-gray-900 text-white rounded-md shadow-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800 transition ease-in-out duration-150 hover:bg-gray-600"
      >
        Add todo
      </button>
    </form>

    <ul v-if="allTodos" class="py-5">
      <li v-for="todo in allTodos" class="flex items-center py-3 border-b border-gray-300">
        <font-awesome-icon :icon="['far', todo.isComplete ? 'check-square' : 'square']" class="cursor-pointer text-xl"
                           @click="toggleTodo(todo)"/>
        <span class="px-4 flex-grow text-lg whitespace-no-wrap" :class="{'line-through': todo.isComplete}">{{ todo.todo }}</span>
        <font-awesome-icon :icon="['far', 'trash-alt']" class="cursor-pointer text-xl text-red-600"
                           @click="deleteTodo(todo.id)"/>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, useContext} from '@nuxtjs/composition-api'
import {useTodos} from '~/compositions/useTodos'

export default defineComponent({
  setup() {
    const {store} = useContext()

    const state = reactive({
      newTodo: "",
    })

    const {allTodos, addTodo, deleteTodo, toggleTodo} = useTodos(store)

    return {
      state,
      allTodos,
      addTodo,
      deleteTodo,
      toggleTodo,
    }
  }
})
</script>