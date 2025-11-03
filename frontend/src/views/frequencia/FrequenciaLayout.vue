<template>
  <div>
    <!-- Submenu de Frequência -->
    <nav class="bg-gray-50 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-6 h-10">
          <RouterLink
            to="/frequencia/aulas"
            class="border-transparent text-gray-600 hover:text-gray-900 inline-flex items-center px-1 border-b-2 text-sm font-medium transition-colors"
            active-class="border-blue-500 text-blue-600"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Aulas
          </RouterLink>
          
          <RouterLink
            to="/frequencia/relatorio"
            class="border-transparent text-gray-600 hover:text-gray-900 inline-flex items-center px-1 border-b-2 text-sm font-medium transition-colors"
            active-class="border-blue-500 text-blue-600"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Relatórios
          </RouterLink>
          
          <RouterLink
            to="/frequencia/justificativas"
            class="border-transparent text-gray-600 hover:text-gray-900 inline-flex items-center px-1 border-b-2 text-sm font-medium transition-colors"
            active-class="border-blue-500 text-blue-600"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Justificativas
          </RouterLink>
        </div>
      </div>
    </nav>

    <!-- Conteúdo da página -->
    <div class="py-8">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>
