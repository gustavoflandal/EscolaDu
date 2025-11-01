<template>
  <div>
    <!-- Cabeçalho -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Cadastros Básicos</h1>
      <div class="flex gap-3">
        <RouterLink to="/" class="btn btn-secondary">Voltar</RouterLink>
      </div>
    </div>

    <!-- Cards de Navegação -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Card Séries -->
      <RouterLink
        v-if="hasPermission('cadastros', 'read')"
        to="/cadastros/series"
        class="card hover:shadow-lg transition-shadow cursor-pointer"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Séries</h3>
            <p class="text-gray-600 text-sm">
              Gerencie as séries escolares
            </p>
          </div>
          <div class="bg-primary-100 p-3 rounded-lg">
            <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
      </RouterLink>

      <!-- Card Salas -->
      <RouterLink
        v-if="hasPermission('cadastros', 'read')"
        to="/cadastros/salas"
        class="card hover:shadow-lg transition-shadow cursor-pointer"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Salas</h3>
            <p class="text-gray-600 text-sm">
              Gerencie as salas de aula
            </p>
          </div>
          <div class="bg-green-100 p-3 rounded-lg">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
      </RouterLink>

      <!-- Card Feriados -->
      <RouterLink
        v-if="hasPermission('cadastros', 'read')"
        to="/cadastros/feriados"
        class="card hover:shadow-lg transition-shadow cursor-pointer"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Feriados</h3>
            <p class="text-gray-600 text-sm">
              Gerencie os feriados do calendário
            </p>
          </div>
          <div class="bg-red-100 p-3 rounded-lg">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </RouterLink>
    </div>

    <!-- Informações Adicionais -->
    <div class="card mt-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Sobre os Cadastros Básicos</h3>
      <div class="space-y-3 text-gray-600 text-sm">
        <p>
          <strong>Séries:</strong> Configure as séries disponíveis na escola, organizadas por nível de ensino (Infantil, Fundamental I, II e Médio).
        </p>
        <p>
          <strong>Salas:</strong> Cadastre as salas de aula com informações sobre capacidade, localização e recursos disponíveis.
        </p>
        <p>
          <strong>Feriados:</strong> Registre os feriados nacionais, estaduais, municipais e escolares para planejamento do calendário letivo.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePermissions } from '@/composables/usePermissions'

const { hasPermission } = usePermissions()
</script>
