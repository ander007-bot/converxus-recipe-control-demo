export interface Recipe {
  id: string;
  name: string;
  liters: number;
  minutes: number;
  description: string;
}

export const RECIPES: Recipe[] = [
  {
    id: 'REC-01',
    name: 'Desinfectante Industrial A',
    liters: 500,
    minutes: 12,
    description: 'Dosificación de agua tratada + concentrado A con agitación final',
  },
  {
    id: 'REC-02',
    name: 'Detergente Alcalino B',
    liters: 750,
    minutes: 18,
    description: 'Carga en dos etapas con verificación de caudal',
  },
  {
    id: 'REC-03',
    name: 'Limpiador Neutro C',
    liters: 300,
    minutes: 8,
    description: 'Carga rápida con control de nivel por LT',
  },
  {
    id: 'REC-04',
    name: 'Enjuague / Limpieza CIP',
    liters: 200,
    minutes: 6,
    description: 'Rutina CIP de línea y manifold de distribución',
  },
  {
    id: 'REC-05',
    name: 'Sanitizante Especial D',
    liters: 1000,
    minutes: 24,
    description: 'Preparación con doble confirmación de válvula',
  },
  {
    id: 'REC-06',
    name: 'Producto Base E',
    liters: 1250,
    minutes: 28,
    description: 'Carga de base con registro completo de trazabilidad',
  },
];

export const OPERATORS = [
  'Operador 01',
  'Operador 02',
  'Supervisor de Producción',
  'Calidad',
];
