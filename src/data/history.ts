export interface HistoryRecord {
  date: string;
  batch: string;
  recipe: string;
  tank: string;
  operator: string;
  programmed: number;
  real: number | null;
  fillTime: string;
  finalState: 'Correcto' | 'Detenido' | 'Cancelado';
  note: string;
}

export const HISTORY: HistoryRecord[] = [
  {
    date: '2026-07-10 06:42',
    batch: 'L-2026-001',
    recipe: 'Desinfectante Industrial A',
    tank: 'TQ-01',
    operator: 'Operador 01',
    programmed: 500,
    real: 498.7,
    fillTime: '11 min 48 s',
    finalState: 'Correcto',
    note: 'Preparación dentro de tolerancia',
  },
  {
    date: '2026-07-10 07:55',
    batch: 'L-2026-002',
    recipe: 'Detergente Alcalino B',
    tank: 'TQ-02',
    operator: 'Operador 02',
    programmed: 750,
    real: 752.1,
    fillTime: '17 min 32 s',
    finalState: 'Correcto',
    note: 'Verificación de caudal correcta',
  },
  {
    date: '2026-07-10 09:10',
    batch: 'L-2026-003',
    recipe: 'Sanitizante Especial D',
    tank: 'TQ-04',
    operator: 'Supervisor de Producción',
    programmed: 1000,
    real: 997.8,
    fillTime: '23 min 51 s',
    finalState: 'Correcto',
    note: 'Doble confirmación de válvula OK',
  },
  {
    date: '2026-07-10 10:24',
    batch: 'L-2026-004',
    recipe: 'Enjuague / Limpieza CIP',
    tank: 'TQ-03',
    operator: 'Operador 01',
    programmed: 200,
    real: null,
    fillTime: '02 min 14 s',
    finalState: 'Detenido',
    note: 'Detenido por alarma de nivel alto-alto',
  },
  {
    date: '2026-07-10 11:40',
    batch: 'L-2026-005',
    recipe: 'Producto Base E',
    tank: 'TQ-02',
    operator: 'Operador 02',
    programmed: 1250,
    real: 1247.5,
    fillTime: '27 min 20 s',
    finalState: 'Correcto',
    note: 'Registro de trazabilidad completo',
  },
  {
    date: '2026-07-09 15:05',
    batch: 'L-2026-098',
    recipe: 'Limpiador Neutro C',
    tank: 'TQ-01',
    operator: 'Calidad',
    programmed: 300,
    real: 299.4,
    fillTime: '07 min 58 s',
    finalState: 'Correcto',
    note: 'Lote de validación de calidad',
  },
  {
    date: '2026-07-09 12:30',
    batch: 'L-2026-097',
    recipe: 'Desinfectante Industrial A',
    tank: 'TQ-03',
    operator: 'Operador 01',
    programmed: 500,
    real: 501.2,
    fillTime: '12 min 05 s',
    finalState: 'Correcto',
    note: 'Preparación dentro de tolerancia',
  },
  {
    date: '2026-07-09 08:15',
    batch: 'L-2026-096',
    recipe: 'Detergente Alcalino B',
    tank: 'TQ-02',
    operator: 'Operador 02',
    programmed: 750,
    real: 748.9,
    fillTime: '18 min 10 s',
    finalState: 'Correcto',
    note: 'Sin desviaciones',
  },
];
