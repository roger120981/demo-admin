// src/utils/dateUtils.ts

// Función para convertir fechas al formato yyyy-MM-dd
export const formatDateForInput = (date?: string | number | Date): string => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };
  
  // Tipo para el campo caregiverIds en FormField
  export type CaregiverField = {
    value?: number[];
    onChange: (value: number[]) => void;
  };