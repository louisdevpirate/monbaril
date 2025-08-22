import { z, ZodError } from 'zod';

// Type pour les erreurs de validation
export interface ValidationError {
  field: string;
  message: string;
}

// Type pour le résultat de validation
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

// Fonction de validation générique
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: ValidationError[] = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return {
        success: false,
        errors,
      };
    }

    // Erreur inattendue
    return {
      success: false,
      errors: [
        {
          field: 'unknown',
          message: 'Erreur de validation inattendue',
        },
      ],
    };
  }
}

// Fonction de validation avec transformation des erreurs
export function validateAndTransform<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: ValidationError[] = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return {
        success: false,
        errors,
      };
    }

    return {
      success: false,
      errors: [
        {
          field: 'unknown',
          message: 'Erreur de validation inattendue',
        },
      ],
    };
  }
}

// Fonction pour valider les données de formulaire
export function validateFormData<T>(
  schema: z.ZodSchema<T>,
  formData: FormData
): ValidationResult<T> {
  try {
    // Convertir FormData en objet
    const data: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: ValidationError[] = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return {
        success: false,
        errors,
      };
    }

    return {
      success: false,
      errors: [
        {
          field: 'unknown',
          message: 'Erreur de validation inattendue',
        },
      ],
    };
  }
}

// Fonction pour valider les paramètres d'URL
export function validateParams<T>(
  schema: z.ZodSchema<T>,
  params: Record<string, string | string[]>
): ValidationResult<T> {
  try {
    const validatedParams = schema.parse(params);
    return {
      success: true,
      data: validatedParams,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: ValidationError[] = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return {
        success: false,
        errors,
      };
    }

    return {
      success: false,
      errors: [
        {
          field: 'unknown',
          message: 'Erreur de validation inattendue',
        },
      ],
    };
  }
}

// Fonction pour valider les headers
export function validateHeaders<T>(
  schema: z.ZodSchema<T>,
  headers: Headers
): ValidationResult<T> {
  try {
    // Convertir Headers en objet
    const headerData: Record<string, string> = {};
    headers.forEach((value, key) => {
      headerData[key] = value;
    });

    const validatedHeaders = schema.parse(headerData);
    return {
      success: true,
      data: validatedHeaders,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: ValidationError[] = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return {
        success: false,
        errors,
      };
    }

    return {
      success: false,
      errors: [
        {
          field: 'unknown',
          message: 'Erreur de validation inattendue',
        },
      ],
    };
  }
}

// Fonction pour nettoyer les données sensibles des logs
export function sanitizeForLogging(data: any): any {
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
  
  if (typeof data === 'object' && data !== null) {
    const sanitized = { ...data };
    
    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }
  
  return data;
} 