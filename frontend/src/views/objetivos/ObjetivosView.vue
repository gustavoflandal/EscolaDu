<template>
  <div>
    <!-- Cabeçalho -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Objetivos de Aprendizagem</h1>
        <p class="text-gray-600 mt-1">
          Avalie o desempenho dos alunos e acompanhe o desenvolvimento de competências
        </p>
      </div>
      <RouterLink to="/" class="btn btn-secondary">Voltar ao Dashboard</RouterLink>
    </div>

    <!-- Cards de Funcionalidades -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Avaliação em Grade -->
      <RouterLink
        to="/objetivos/avaliar"
        class="card hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500"
      >
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span class="text-2xl">✍️</span>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Avaliar Turma</h3>
            <p class="text-sm text-gray-600">
              Avalie múltiplos objetivos para todos os alunos da turma em uma grade interativa
            </p>
          </div>
        </div>
      </RouterLink>

      <!-- Mapa de Proficiência -->
      <RouterLink
        to="/objetivos/mapa"
        class="card hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500"
      >
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
            <span class="text-2xl">🗺️</span>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Mapa de Proficiência</h3>
            <p class="text-sm text-gray-600">
              Visualize a matriz de desempenho do aluno em todos os objetivos de aprendizagem
            </p>
          </div>
        </div>
      </RouterLink>

      <!-- Acompanhamento Longitudinal -->
      <RouterLink
        to="/objetivos/longitudinal"
        class="card hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-500"
      >
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
            <span class="text-2xl">📈</span>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Acompanhamento Longitudinal</h3>
            <p class="text-sm text-gray-600">
              Acompanhe a evolução do aluno ao longo dos anos letivos com gráficos e estatísticas
            </p>
          </div>
        </div>
      </RouterLink>
    </div>

    <!-- Informações Adicionais -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Card Informativo 1 -->
      <div class="card bg-blue-50 border-blue-200">
        <h4 class="text-sm font-semibold text-blue-900 mb-2">📊 Status de Avaliação</h4>
        <p class="text-xs text-blue-700">
          <strong>A</strong> = Atingido • <strong>D</strong> = Em Desenvolvimento •
          <strong>N</strong> = Não Atingido • <strong>NA</strong> = Não Avaliado
        </p>
      </div>

      <!-- Card Informativo 2 -->
      <div class="card bg-green-50 border-green-200">
        <h4 class="text-sm font-semibold text-green-900 mb-2">📎 Evidências</h4>
        <p class="text-xs text-green-700">
          Anexe fotos, vídeos, documentos e projetos como evidências do aprendizado dos alunos
        </p>
      </div>

      <!-- Card Informativo 3 -->
      <div class="card bg-purple-50 border-purple-200">
        <h4 class="text-sm font-semibold text-purple-900 mb-2">🎯 Análise de Desempenho</h4>
        <p class="text-xs text-purple-700">
          Visualize estatísticas, rankings e tendências de desempenho da turma e alunos individuais
        </p>
      </div>
    </div>

    <!-- Atalhos Rápidos -->
    <div class="mt-8 card bg-gray-50">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Atalhos Rápidos</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <RouterLink
          to="/turmas"
          class="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition"
        >
          <span>👥</span>
          <span>Gerenciar Turmas</span>
        </RouterLink>
        <RouterLink
          to="/alunos"
          class="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition"
        >
          <span>🎓</span>
          <span>Gerenciar Alunos</span>
        </RouterLink>
        <RouterLink
          to="/disciplinas"
          class="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition"
        >
          <span>📚</span>
          <span>Gerenciar Disciplinas</span>
        </RouterLink>
        <RouterLink
          to="/relatorios"
          class="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition"
        >
          <span>📄</span>
          <span>Relatórios</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>
