/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Logic engine for Vet-Triage
 * Incorporates the 22 clinical emergency signs and the golden rule:
 * "Ante la duda, subir de nivel" (Sara, Julián, Cristóbal - Oct 2026)
 */

export type UrgencyLevel = 'Alto' | 'Moderado' | 'Bajo';
export type Species = 'Canino' | 'Felino';

export interface UrgencySign {
  id: string;
  code: string;
  name: string;
  category: 'sólido' | 'umbral_por_contrastar' | 'en_conflicto' | 'sin_fuente';
  defaultLevel: UrgencyLevel;
  speciesSpecific?: Species;
  description: string;
  literatureStatus: string;
  thresholdNote?: string;
  escalationRule?: string;
}

export const URGENCY_SIGNS: UrgencySign[] = [
  // 12 Sólidos
  {
    id: 's-01',
    code: 'DIF_RESP_SEV',
    name: 'Dificultad respiratoria severa / Cianosis / Ortopnea',
    category: 'sólido',
    defaultLevel: 'Alto',
    description: 'Respiración con boca abierta, mucosas azules/pálidas, esfuerzo abdominal severo.',
    literatureStatus: 'Sólido (13 fuentes veterinarias)',
  },
  {
    id: 's-02',
    code: 'PARO_COLAPSO',
    name: 'Paro cardiorrespiratorio o colapso agudo sin respuesta',
    category: 'sólido',
    defaultLevel: 'Alto',
    description: 'Inconsciencia súbita, ausencia de pulso palpable o respiración agónica.',
    literatureStatus: 'Sólido',
  },
  {
    id: 's-03',
    code: 'CONVULSION_STATUS',
    name: 'Convulsiones activas continuas o en racimo (>3 min)',
    category: 'sólido',
    defaultLevel: 'Alto',
    description: 'Estatus epiléptico continuo o múltiples convulsiones sin recuperar consciencia.',
    literatureStatus: 'Sólido',
  },
  {
    id: 's-04',
    code: 'TRAUMA_POLI',
    name: 'Trauma de alto impacto / Atropellamiento vehicular',
    category: 'sólido',
    defaultLevel: 'Alto',
    description: 'Sospecha de hemorragia interna, neumotórax o fracturas inestables.',
    literatureStatus: 'Sólido',
  },
  {
    id: 's-05',
    code: 'HEMORRAGIA_SEV',
    name: 'Hemorragia arterial o profusa no controlable',
    category: 'sólido',
    defaultLevel: 'Alto',
    description: 'Sangrado pulsátil o abundante que no cede a la compresión directa.',
    literatureStatus: 'Sólido',
  },
  {
    id: 's-06',
    code: 'DILAT_TORSION_GAST',
    name: 'Sospecha de Dilatación-Torsión Gástrica (GDV)',
    category: 'sólido',
    defaultLevel: 'Alto',
    speciesSpecific: 'Canino',
    description: 'Abdomen distendido y timpanítico, intentos infructuosos de vomitar, inquietud extrema.',
    literatureStatus: 'Sólido',
  },
  {
    id: 's-07',
    code: 'OBSTRUC_URETRAL',
    name: 'Obstrucción uretral aguda / Anuria dolorosa',
    category: 'sólido',
    defaultLevel: 'Alto',
    description: 'Imposibilidad de orinar, maullidos/quejidos en el arenero, vejiga distendida y dura.',
    literatureStatus: 'Sólido (muy crítico en machos felinos)',
  },
  {
    id: 's-08',
    code: 'ESTADO_MENTAL_ESTUPOR',
    name: 'Estupor profundo, coma o falta total de respuesta',
    category: 'sólido',
    defaultLevel: 'Alto',
    description: 'Pérdida del reflejo de amenaza, incapacidad para incorporarse.',
    literatureStatus: 'Sólido',
  },
  {
    id: 's-09',
    code: 'TEMPERATURA_EXTREMA',
    name: 'Hipotermia extrema (<36°C) o Golpe de calor (>41°C)',
    category: 'sólido',
    defaultLevel: 'Alto',
    description: 'Alteración térmica crítica que desencadena fallo multiorgánico.',
    literatureStatus: 'Sólido',
  },
  {
    id: 's-10',
    code: 'INTOXICACION_AGUDA',
    name: 'Intoxicación aguda conocida (rodenticida, lirios, etc.)',
    category: 'sólido',
    defaultLevel: 'Alto',
    description: 'Ingestión reciente de tóxicos mortales o neurotoxinas con o sin signos.',
    literatureStatus: 'Sólido',
  },
  {
    id: 's-11',
    code: 'QUEMADURA_EXTENSA',
    name: 'Quemaduras de 2do/3er grado extensas (>15% corporal)',
    category: 'sólido',
    defaultLevel: 'Alto',
    description: 'Lesiones térmicas o químicas severas con riesgo de shock hipovolémico.',
    literatureStatus: 'Sólido',
  },
  {
    id: 's-12',
    code: 'PROPTOSIS_OCULAR',
    name: 'Proptosis ocular o perforación corneal aguda',
    category: 'sólido',
    defaultLevel: 'Alto',
    description: 'Globo ocular fuera de la órbita o traumatismo penetrante ocular.',
    literatureStatus: 'Sólido',
  },

  // 8 con umbral por contrastar
  {
    id: 's-13',
    code: 'TAQUIPNEA_MOD',
    name: 'Taquipnea o respiración acelerada sin cianosis',
    category: 'umbral_por_contrastar',
    defaultLevel: 'Moderado',
    description: 'Frecuencia respiratoria elevada pero mucosas rosadas.',
    literatureStatus: 'Umbral por contrastar: >40 resp/min en reposo.',
    thresholdNote: 'Si la frecuencia supera 60 resp/min o hay esfuerzo abdominal, sube a Alto.',
    escalationRule: 'Ante la duda o si empeora en 30m, subir a Alto.',
  },
  {
    id: 's-14',
    code: 'DOLOR_ABDOMINAL',
    name: 'Dolor abdominal agudo moderado sin distensión masiva',
    category: 'umbral_por_contrastar',
    defaultLevel: 'Moderado',
    description: 'Postura de rezo, quejido a la palpación pero abdomen blando.',
    literatureStatus: 'Umbral por contrastar (Escala de dolor Glasgow/Colorado).',
  },
  {
    id: 's-15',
    code: 'VOMITO_REPETIDO',
    name: 'Vómitos repetidos (>3 episodios en 12 horas)',
    category: 'umbral_por_contrastar',
    defaultLevel: 'Moderado',
    description: 'Riesgo de deshidratación y desequilibrio electrolítico.',
    literatureStatus: 'Umbral por contrastar (Frecuencia >3 vs >5 episodios).',
  },
  {
    id: 's-16',
    code: 'COJERA_AGUDA_FRACTURA',
    name: 'Cojera aguda sin apoyo con sospecha de fractura cerrada',
    category: 'umbral_por_contrastar',
    defaultLevel: 'Moderado',
    description: 'Imposibilidad de apoyar la extremidad sin exposición ósea externa.',
    literatureStatus: 'Umbral por contrastar (fractura cerrada vs abierta).',
  },
  {
    id: 's-17',
    code: 'HERIDA_LACERACION',
    name: 'Herida abierta profunda o laceración cutánea amplia',
    category: 'umbral_por_contrastar',
    defaultLevel: 'Moderado',
    description: 'Pérdida de continuidad dérmica sin compromiso de grandes vasos.',
    literatureStatus: 'Umbral por contrastar (>5 cm o fascia expuesta).',
  },
  {
    id: 's-18',
    code: 'LETARGIA_DESHIDRATACION',
    name: 'Letargia marcada con deshidratación clínica (>7%)',
    category: 'umbral_por_contrastar',
    defaultLevel: 'Moderado',
    description: 'Retardo en pliegue cutáneo >3s, encías secas, apatía.',
    literatureStatus: 'Umbral por contrastar (% deshidratación 5-7% vs >8%).',
  },
  {
    id: 's-19',
    code: 'DIARREA_HEMORRAGICA',
    name: 'Diarrea hemorrágica abundante sin signos de shock',
    category: 'umbral_por_contrastar',
    defaultLevel: 'Moderado',
    description: 'Evacuación de heces con sangre (melena o hematoquecia) pero consciente y activo.',
    literatureStatus: 'Umbral por contrastar (estabilidad hemodinámica presente).',
    escalationRule: 'Si se acompaña de palidez o hipotensión, escalar a Alto.',
  },
  {
    id: 's-20',
    code: 'DISURIA_HEMATURIA',
    name: 'Disuria o hematuria con micción presente',
    category: 'umbral_por_contrastar',
    defaultLevel: 'Moderado',
    description: 'Dificultad o dolor al orinar pero produce chorro de orina.',
    literatureStatus: 'Umbral por contrastar (micción parcial vs obstrucción total).',
  },

  // 1 en conflicto
  {
    id: 's-21',
    code: 'VOMITO_SANGRE_HEMATEMESIS',
    name: 'Vómito con sangre visible (Hematemesis)',
    category: 'en_conflicto',
    defaultLevel: 'Alto', // Elevated due to "ante la duda, subir de nivel"
    description: 'Vómito con sangre fresca o en posos de café. Fuentes en conflicto sobre si es moderado o alto si el volumen es bajo.',
    literatureStatus: 'En conflicto bibliográfico: asignado a ALTO por principio precautorio del proyecto.',
    escalationRule: 'Regla del Comité: "Ante la duda, subir de nivel". Clasificado como ALTO prioritario.',
  },

  // 1 sin fuente
  {
    id: 's-22',
    code: 'DIARREA_AISLADA',
    name: 'Diarrea acuosa aislada (sin vómito, alerta y activo)',
    category: 'sin_fuente',
    defaultLevel: 'Bajo',
    description: 'Episodio autolimitado sin alteración del estado de alerta ni deshidratación.',
    literatureStatus: 'Sin fuente específica en triaje primario. Declarado como limitación del estudio.',
    thresholdNote: 'Cuadro ambulatorio diferible.',
  },
];

export interface TriageInput {
  patientName?: string;
  species: Species;
  ageYears?: number | null;
  weightKg?: number | null;
  chiefComplaint: string;
  selectedSignIds: string[];
  isDoubtful?: boolean; // User or operator expresses clinical ambiguity
  durationHours?: number;
  additionalNotes?: string;
}

export interface TriageEvaluation {
  level: UrgencyLevel;
  badgeColor: string;
  recommendedWaitTime: string;
  justification: string[];
  rulesApplied: string[];
  immediateRecommendations: string[];
  escalationSteps: string[];
  isEscalatedByPrecaution: boolean;
  limitationsNoted: string[];
}

export function evaluateTriage(input: TriageInput): TriageEvaluation {
  const selectedSigns = URGENCY_SIGNS.filter(s => input.selectedSignIds.includes(s.id));
  const rulesApplied: string[] = [];
  const limitationsNoted: string[] = [];
  const justification: string[] = [];

  let highestSignLevel: UrgencyLevel = 'Bajo';

  // Check if any Alto sign is present
  const hasAlto = selectedSigns.some(s => s.defaultLevel === 'Alto');
  const hasModerado = selectedSigns.some(s => s.defaultLevel === 'Moderado');

  if (hasAlto) {
    highestSignLevel = 'Alto';
  } else if (hasModerado) {
    highestSignLevel = 'Moderado';
  } else if (selectedSigns.length > 0) {
    highestSignLevel = 'Bajo';
  } else {
    // No specific sign checked, evaluate based on complaint heuristics
    highestSignLevel = 'Bajo';
  }

  // Record signs
  selectedSigns.forEach(s => {
    justification.push(`Signo identificado: ${s.name} (${s.defaultLevel}). Categoría: ${s.category}`);
    if (s.category === 'umbral_por_contrastar' || s.category === 'sin_fuente' || s.category === 'en_conflicto') {
      limitationsNoted.push(`${s.name}: ${s.literatureStatus}`);
    }
  });

  // Apply Team Rule: "Ante la duda, subir de nivel"
  let isEscalatedByPrecaution = false;
  let finalLevel: UrgencyLevel = highestSignLevel;

  // Conflict sign rule (s-21) specifically triggers precautionary ceiling
  const hasConflictSign = selectedSigns.some(s => s.category === 'en_conflicto');
  if (hasConflictSign) {
    rulesApplied.push('Regla de conflicto clínico (T-11): Vómito con sangre clasificado en nivel ALTO preventivo.');
  }

  // Precautionary upgrade if user/evaluator marks ambiguity OR multiple moderate signs (>2)
  if (input.isDoubtful || (hasModerado && selectedSigns.filter(s => s.defaultLevel === 'Moderado').length >= 3)) {
    if (finalLevel === 'Bajo') {
      finalLevel = 'Moderado';
      isEscalatedByPrecaution = true;
      rulesApplied.push('Regla del comité: "Ante la duda, subir de nivel" aplicada (Bajo -> Moderado).');
    } else if (finalLevel === 'Moderado') {
      finalLevel = 'Alto';
      isEscalatedByPrecaution = true;
      rulesApplied.push('Regla del comité: "Ante la duda, subir de nivel" aplicada por multiplicidad o ambigüedad (Moderado -> Alto).');
    }
  }

  // Cat with urinary signs rule: always escalate to Alto if species is feline
  const hasFelineUrinary = input.species === 'Felino' && selectedSigns.some(s => s.code === 'DISURIA_HEMATURIA' || s.code === 'OBSTRUC_URETRAL');
  if (hasFelineUrinary && finalLevel !== 'Alto') {
    finalLevel = 'Alto';
    isEscalatedByPrecaution = true;
    rulesApplied.push('Regla de alto riesgo felino: Todo gato con dificultad urinaria se escala a ALTO por riesgo de uretrostomía/bloqueo mortal.');
  }

  // Generate Recommendations and Escalation protocols (T-22 & T-23)
  const immediateRecommendations: string[] = [];
  const escalationSteps: string[] = [];

  if (finalLevel === 'Alto') {
    immediateRecommendations.push('🔴 Mantener al paciente en posición esternal, con cuello extendido y vía aérea despejada.');
    immediateRecommendations.push('🔴 No administrar comida, leche, agua ni medicamentos orales humanos (prohibido paracetamol/ibuprofeno).');
    immediateRecommendations.push('🔴 Trasladar inmediatamente en un transportín rígido o toalla estabilizadora manteniendo temperatura estable.');
    immediateRecommendations.push('🔴 Llamar a la clínica de urgencias en camino para que preparen box de reanimación y oxigenoterapia.');

    escalationSteps.push('Escalamiento Inmediato (T-23): Contactar central de urgencias 24h.');
    escalationSteps.push('Tiempo máximo de atención recomendado: < 15 minutos.');
    escalationSteps.push('Alerta de triage activada: prioridad de ingreso sin espera.');
  } else if (finalLevel === 'Moderado') {
    immediateRecommendations.push('🟡 Mantener en reposo absoluto en un ambiente tranquilo y templado.');
    immediateRecommendations.push('🟡 Retirar acceso a raciones grandes de comida; permitir pequeños sorbos de agua templada si no hay vómitos activos.');
    immediateRecommendations.push('🟡 Medir frecuencia respiratoria en reposo contando elevaciones del tórax en 1 minuto.');
    immediateRecommendations.push('🟡 Monitorear color de encías (deben ser rosadas, no blancas ni azuladas).');

    escalationSteps.push('Escalamiento Diferible (T-23): Consulta prioritaria el mismo día.');
    escalationSteps.push('Tiempo máximo de atención sugerido: < 1 a 2 horas.');
    escalationSteps.push('Criterio de re-evaluación: Si presenta vómito con sangre o debilidad motora, re-clasificar como ALTO.');
  } else {
    immediateRecommendations.push('🟢 Monitorear ingesta voluntaria de agua y apetito durante las próximas 12-24 horas.');
    immediateRecommendations.push('🟢 Dieta blanda de fácil digestión previa indicación.');
    immediateRecommendations.push('🟢 Aislar de otros animales si hay sospecha de patología digestiva infecciosa.');

    escalationSteps.push('Atención ambulatoria programada según disponibilidad.');
    escalationSteps.push('Criterio de alarma: Si aparecen vómitos frecuentes o letargia severa, consultar de urgencia.');
  }

  const waitTimes: Record<UrgencyLevel, string> = {
    Alto: 'Inmediata (< 15 minutos)',
    Moderado: 'Prioritaria (< 60 a 120 minutos)',
    Bajo: 'Diferible / Ambulatoria (24 a 48 horas)',
  };

  const badgeColors: Record<UrgencyLevel, string> = {
    Alto: 'bg-rose-600 text-white border-rose-700',
    Moderado: 'bg-amber-500 text-slate-950 border-amber-600',
    Bajo: 'bg-emerald-600 text-white border-emerald-700',
  };

  return {
    level: finalLevel,
    badgeColor: badgeColors[finalLevel],
    recommendedWaitTime: waitTimes[finalLevel],
    justification,
    rulesApplied,
    immediateRecommendations,
    escalationSteps,
    isEscalatedByPrecaution,
    limitationsNoted,
  };
}
