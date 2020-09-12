<template>
  <div class="py-5">
    <template v-if="doneTodos.length > 0">
      <ul>
        <li v-for="todo in doneTodos" class="py-3 border-b border-gray-300">
          <font-awesome-icon :icon="['far', todo.isComplete ? 'check-square' : 'square']" class="cursor-pointer text-xl"
                             @click="toggleTodo(todo)"/>
          <span class="px-4 text-lg whitespace-no-wrap">{{ todo.todo }}</span>
        </li>
      </ul>
    </template>
    <template v-else>
      <h2 class="text-2xl font-semibold">You did nothing! Go on and work on your todos...</h2>
    </template>
  </div>
</template>

<script lang="ts">
import {defineComponent, useContext} from '@nuxtjs/composition-api'
import {useTodos} from "~/compositions/useTodos";

export default defineComponent({
  setup() {
    const {store} = useContext()

    const {doneTodos, toggleTodo} = useTodos(store)

    return {
      doneTodos,
      toggleTodo
    }
  }
})
</script>