import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Gera hash da senha
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verifica se a senha corresponde ao hash
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Valida força da senha
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Senha deve ter no mínimo 8 caracteres');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Senha deve conter pelo menos um número');
  }

  if (!/[@$!%*?&#]/.test(password)) {
    errors.push('Senha deve conter pelo menos um caractere especial (@$!%*?&#)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
