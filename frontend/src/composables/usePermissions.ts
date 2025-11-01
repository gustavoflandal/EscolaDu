import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

/**
 * Composable para verificação de permissões
 */
export function usePermissions() {
  const authStore = useAuthStore()

  /**
   * Verifica se o usuário tem uma permissão específica
   */
  const hasPermission = (resource: string, action: string): boolean => {
    if (!authStore.user?.permissions) return false
    
    return authStore.user.permissions.some(
      (permission) => 
        permission.resource === resource && permission.action === action
    )
  }

  /**
   * Verifica se o usuário tem qualquer permissão para um recurso
   */
  const hasAnyPermissionForResource = (resource: string): boolean => {
    if (!authStore.user?.permissions) return false
    
    return authStore.user.permissions.some(
      (permission) => permission.resource === resource
    )
  }

  /**
   * Verifica se o usuário tem pelo menos uma das permissões especificadas
   */
  const hasAnyPermission = (permissions: Array<{ resource: string; action: string }>): boolean => {
    if (!authStore.user?.permissions) return false
    
    return permissions.some(({ resource, action }) => 
      hasPermission(resource, action)
    )
  }

  /**
   * Verifica se o usuário tem todas as permissões especificadas
   */
  const hasAllPermissions = (permissions: Array<{ resource: string; action: string }>): boolean => {
    if (!authStore.user?.permissions) return false
    
    return permissions.every(({ resource, action }) => 
      hasPermission(resource, action)
    )
  }

  /**
   * Verifica se o usuário tem um role específico
   */
  const hasRole = (roleName: string): boolean => {
    if (!authStore.user?.roles) return false
    
    return authStore.user.roles.some((role) => role.name === roleName)
  }

  /**
   * Verifica se o usuário é administrador
   */
  const isAdmin = computed(() => hasRole('Administrador'))

  /**
   * Mapeamento de módulos para recursos
   */
  const moduleResourceMap: Record<string, string> = {
    'alunos': 'alunos',
    'responsaveis': 'responsaveis',
    'professores': 'professores',
    'turmas': 'turmas',
    'disciplinas': 'disciplinas',
    'frequencia': 'frequencia',
    'objetivos': 'objetivos',
    'relatorios': 'relatorios',
    'usuarios': 'users',
    'perfis': 'roles',
    'dashboard': 'dashboard',
    'cadastros': 'cadastros'
  }

  /**
   * Verifica se o usuário pode acessar um módulo
   * Um módulo é acessível se o usuário tem qualquer permissão para o recurso
   */
  const canAccessModule = (moduleName: string): boolean => {
    const resource = moduleResourceMap[moduleName]
    if (!resource) return false
    
    // Verifica se tem qualquer permissão para o recurso
    return hasAnyPermissionForResource(resource)
  }

  /**
   * Lista de permissões do usuário
   */
  const userPermissions = computed(() => authStore.user?.permissions || [])

  /**
   * Lista de roles do usuário
   */
  const userRoles = computed(() => authStore.user?.roles || [])

  return {
    hasPermission,
    hasAnyPermissionForResource,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    isAdmin,
    canAccessModule,
    userPermissions,
    userRoles
  }
}
