import { config } from 'dotenv';

// Carrega variáveis de ambiente
config();

export const env = {
  // Server
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  databaseUrl: process.env.DATABASE_URL || '',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || '',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // Upload
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
  
  // Email
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  smtpFrom: process.env.SMTP_FROM || 'noreply@sge.com',
  
  // SMS
  smsApiKey: process.env.SMS_API_KEY || '',
  smsApiUrl: process.env.SMS_API_URL || '',
  
  // Sistema
  percentualMinimoFrequencia: 75,
  percentualAlertaFrequencia: 80,
  diasBloqueioEdicaoFrequencia: 7,
  percentualMinimoObjetivos: 70,
  limiteObjetivosCriticos: 3,
};

// Validações
if (!env.jwtSecret || env.jwtSecret.length < 32) {
  throw new Error('JWT_SECRET deve ter no mínimo 32 caracteres');
}

if (!env.databaseUrl) {
  throw new Error('DATABASE_URL não configurada');
}
