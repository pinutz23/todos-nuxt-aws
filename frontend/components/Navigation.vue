<template>
  <div class="relative bg-white">
    <div class="max-w-screen-xl mx-auto">
      <div class="relative z-10 lg:max-w-2xl lg:w-full bg-white pb-8">
        <svg class="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
             fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon points="50,0 100,0 50,100 0,100"/>
        </svg>

        <div class="relative pt-6 px-4 sm:px-6 lg:px-8">
          <nav class="relative flex items-center justify-between sm:h-10 lg:justify-start">
            <div class="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
              <div class="flex items-center justify-between w-full md:w-auto">
                <nuxt-link to="/" aria-label="Home">
                  <img class="h-8 w-auto sm:h-10" src="https://tailwindui.com/img/logos/workflow-mark-on-white.svg"
                       alt="Logo">
                </nuxt-link>
                <div class="-mr-2 flex items-center md:hidden">
                  <button type="button"
                          class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                          id="main-menu" aria-label="Main menu" aria-haspopup="true" @click="toggleIsMenuOpen">
                    <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div class="hidden md:block md:ml-10 md:pr-4">
              <nuxt-link to="/open"
                         class="font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out">Open
              </nuxt-link>
              <nuxt-link to="/done"
                         class="ml-8 font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out">
                Done
              </nuxt-link>
            </div>
          </nav>
        </div>

        <div class="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
             v-if="state.isMenuOpen">
          <div class="rounded-lg shadow-md">
            <div class="rounded-lg bg-white shadow-xs overflow-hidden" role="menu" aria-orientation="vertical"
                 aria-labelledby="main-menu">
              <div class="px-5 pt-4 flex items-center justify-between">
                <nuxt-link to="/">
                  <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-on-white.svg" alt="">
                </nuxt-link>
                <div class="-mr-2">
                  <button type="button"
                          class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                          aria-label="Close menu" @click="toggleIsMenuOpen">
                    <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="px-2 pt-2 pb-3">
                <nuxt-link to="/open"
                           class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out"
                           role="menuitem">Open
                </nuxt-link>
                <nuxt-link to="/done"
                           class="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out"
                           role="menuitem">Done
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive} from "@nuxtjs/composition-api";

export default defineComponent({
  setup() {
    const state = reactive({
      isMenuOpen: false
    })

    const toggleIsMenuOpen = () => state.isMenuOpen = !state.isMenuOpen

    return {
      state,
      toggleIsMenuOpen
    }
  }
})
</script>