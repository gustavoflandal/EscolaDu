<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div class="h-20 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div class="flex items-center">
          <img src="/logo.png" alt="SGE - Sistema de Gestão Escolar" class="h-12 md:h-16 lg:h-20 object-contain" />
        </div>
        <div class="flex items-center">
          <UserMenu />
        </div>
      </div>
    </header>

    <!-- Container Principal com Sidebar -->
    <div class="flex flex-1 pt-20">
      <!-- Sidebar -->
      <SidebarMenu />

      <!-- Conteúdo Principal -->
      <main class="flex-1 ml-64 p-6 overflow-auto">
        <div class="max-w-7xl mx-auto">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import UserMenu from '@/components/UserMenu.vue'
import SidebarMenu from '@/components/SidebarMenu.vue'
</script>