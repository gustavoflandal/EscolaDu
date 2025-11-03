<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Configurações</h1>
      <p class="mt-2 text-sm text-gray-600">
        Personalize sua experiência no sistema
      </p>
    </div>

    <!-- Configurações -->
    <div class="space-y-6">
      <!-- Aparência -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Aparência</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-700">Tema</label>
              <p class="text-sm text-gray-500">Escolha o tema do sistema</p>
            </div>
            <select class="form-select" disabled>
              <option>Claro</option>
              <option>Escuro</option>
              <option>Automático</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Notificações -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Notificações</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-700">E-mail</label>
              <p class="text-sm text-gray-500">Receber notificações por e-mail</p>
            </div>
            <input type="checkbox" class="form-checkbox" disabled />
          </div>
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-700">Push</label>
              <p class="text-sm text-gray-500">Receber notificações push</p>
            </div>
            <input type="checkbox" class="form-checkbox" disabled />
          </div>
        </div>
      </div>

      <!-- Em Desenvolvimento -->
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div class="flex items-start">
          <svg class="h-6 w-6 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">
              Funcionalidade em Desenvolvimento
            </h3>
            <p class="mt-2 text-sm text-yellow-700">
              As configurações completas estarão disponíveis em breve. Por enquanto, você pode editar suas informações através do perfil.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Placeholder para página de configurações
</script>
