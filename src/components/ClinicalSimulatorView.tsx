/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Estación de Triaje Clínico Veterinario (Panel del Médico Veterinario)
 * Sin emojis, paleta de colores personalizada y constantes fisiológicas.
 */
import React, { useState } from 'react';
import { 
  Stethoscope, 
  Activity, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  User, 
  ClipboardList, 
  PlusCircle, 
  CheckCircle2, 
  Heart,
  Thermometer,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  evaluateTriage, 
  URGENCY_SIGNS, 
  Species, 
  TriageInput, 
  TriageEvaluation 
} from '../utils/triageRules';

interface ClinicalQueuePatient {
  id: string;
  name: string;
  species: Species;
  breed: string;
  ageYears: number;
  weightKg: number;
  chiefComplaint: string;
  selectedSignIds: string[];
  isDoubtful: boolean;
  heartRate: number;
  respiratoryRate: number;
  temperatureC: number;
  mucousMembranes: 'Rosadas' | 'Pálidas' | 'Cianóticas' | 'Congestivas' | 'Ictéricas';
  crtSeconds: number;
  mentalStatus: 'Alerta' | 'Deprimido' | 'Estuporoso' | 'Comatoso';
  arrivalMinutesAgo: number;
  assignedBox: string;
}

const INITIAL_QUEUE: ClinicalQueuePatient[] = [
  {
    id: 'ADM-101',
    name: 'Thor',
    species: 'Canino',
    breed: 'Gran Danés',
    ageYears: 7,
    weightKg: 54.0,
    chiefComplaint: 'Abdomen timpanítico distendido, intentos de vómito improductivos tras comida copiosa',
    selectedSignIds: ['s-06'],
    isDoubtful: false,
    heartRate: 165,
    respiratoryRate: 48,
    temperatureC: 38.6,
    mucousMembranes: 'Pálidas',
    crtSeconds: 3.0,
    mentalStatus: 'Deprimido',
    arrivalMinutesAgo: 6,
    assignedBox: 'Box 1 · Reanimación',
  },
  {
    id: 'ADM-102',
    name: 'Milo',
    species: 'Felino',
    breed: 'Común Europeo',
    ageYears: 3,
    weightKg: 4.8,
    chiefComplaint: 'Macho quejumbroso en arenero, esfuerzo doloroso sin emisión de orina hace 16h',
    selectedSignIds: ['s-07', 's-14'],
    isDoubtful: false,
    heartRate: 210,
    respiratoryRate: 42,
    temperatureC: 37.8,
    mucousMembranes: 'Rosadas',
    crtSeconds: 1.5,
    mentalStatus: 'Deprimido',
    arrivalMinutesAgo: 12,
    assignedBox: 'Box 2 · Procedimientos',
  },
  {
    id: 'ADM-103',
    name: 'Rocky',
    species: 'Canino',
    breed: 'Bulldog Francés',
    ageYears: 5,
    weightKg: 12.5,
    chiefComplaint: 'Vómito con contenido hemático evidente (hematemesis). Cuadro limítrofe.',
    selectedSignIds: ['s-21'],
    isDoubtful: true,
    heartRate: 130,
    respiratoryRate: 32,
    temperatureC: 38.8,
    mucousMembranes: 'Rosadas',
    crtSeconds: 1.5,
    mentalStatus: 'Alerta',
    arrivalMinutesAgo: 25,
    assignedBox: 'Box 3 · Urgencias',
  },
  {
    id: 'ADM-104',
    name: 'Luna',
    species: 'Canino',
    breed: 'Golden Retriever',
    ageYears: 2,
    weightKg: 28.0,
    chiefComplaint: 'Vómitos continuos (4 episodios en 8 horas), encías húmedas y actitud atenta',
    selectedSignIds: ['s-15'],
    isDoubtful: false,
    heartRate: 110,
    respiratoryRate: 24,
    temperatureC: 38.5,
    mucousMembranes: 'Rosadas',
    crtSeconds: 1.0,
    mentalStatus: 'Alerta',
    arrivalMinutesAgo: 38,
    assignedBox: 'Sala de Observación',
  },
  {
    id: 'ADM-105',
    name: 'Toby',
    species: 'Canino',
    breed: 'Poodle',
    ageYears: 3,
    weightKg: 6.2,
    chiefComplaint: 'Diarrea blanda matutina única tras cambio de dieta, alegre y activo',
    selectedSignIds: ['s-22'],
    isDoubtful: false,
    heartRate: 98,
    respiratoryRate: 20,
    temperatureC: 38.3,
    mucousMembranes: 'Rosadas',
    crtSeconds: 1.0,
    mentalStatus: 'Alerta',
    arrivalMinutesAgo: 50,
    assignedBox: 'Consulta Ambulatoria',
  },
];

export const ClinicalSimulatorView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'evaluacion' | 'cola'>('evaluacion');
  const [patientsQueue, setPatientsQueue] = useState<ClinicalQueuePatient[]>(INITIAL_QUEUE);

  // Current Patient Form State
  const [patientId, setPatientId] = useState('ADM-106');
  const [patientName, setPatientName] = useState('Kira');
  const [species, setSpecies] = useState<Species>('Canino');
  const [breed, setBreed] = useState('Pastor Alemán');
  const [ageYears, setAgeYears] = useState<number | ''>(4);
  const [weightKg, setWeightKg] = useState<number | ''>(26.5);
  const [chiefComplaint, setChiefComplaint] = useState('Traumatismo vehicular leve con laceración profunda en muslo izquierdo y taquipnea');
  const [selectedSignIds, setSelectedSignIds] = useState<string[]>(['s-13', 's-17']);
  const [isDoubtful, setIsDoubtful] = useState(false);

  // Vitals
  const [heartRate, setHeartRate] = useState<number | ''>(135);
  const [respiratoryRate, setRespiratoryRate] = useState<number | ''>(44);
  const [temperatureC, setTemperatureC] = useState<number | ''>(38.7);
  const [mucousMembranes, setMucousMembranes] = useState<'Rosadas' | 'Pálidas' | 'Cianóticas' | 'Congestivas' | 'Ictéricas'>('Rosadas');
  const [crtSeconds, setCrtSeconds] = useState<number | ''>(1.5);
  const [mentalStatus, setMentalStatus] = useState<'Alerta' | 'Deprimido' | 'Estuporoso' | 'Comatoso'>('Alerta');

  // Evaluation Output
  const [evaluation, setEvaluation] = useState<TriageEvaluation>(() => {
    return evaluateTriage({
      patientName: 'Kira',
      species: 'Canino',
      ageYears: 4,
      chiefComplaint: 'Traumatismo vehicular leve con laceración profunda en muslo izquierdo y taquipnea',
      selectedSignIds: ['s-13', 's-17'],
      isDoubtful: false,
    });
  });

  const handleToggleSign = (signId: string) => {
    setSelectedSignIds(prev => 
      prev.includes(signId) ? prev.filter(id => id !== signId) : [...prev, signId]
    );
  };

  const handleRunEvaluation = () => {
    const input: TriageInput = {
      patientName,
      species,
      ageYears: ageYears === '' ? null : Number(ageYears),
      weightKg: weightKg === '' ? null : Number(weightKg),
      chiefComplaint,
      selectedSignIds,
      isDoubtful,
    };
    const res = evaluateTriage(input);
    setEvaluation(res);
  };

  const handleSelectPatientFromQueue = (p: ClinicalQueuePatient) => {
    setPatientId(p.id);
    setPatientName(p.name);
    setSpecies(p.species);
    setBreed(p.breed);
    setAgeYears(p.ageYears);
    setWeightKg(p.weightKg);
    setChiefComplaint(p.chiefComplaint);
    setSelectedSignIds(p.selectedSignIds);
    setIsDoubtful(p.isDoubtful);
    setHeartRate(p.heartRate);
    setRespiratoryRate(p.respiratoryRate);
    setTemperatureC(p.temperatureC);
    setMucousMembranes(p.mucousMembranes);
    setCrtSeconds(p.crtSeconds);
    setMentalStatus(p.mentalStatus);

    const res = evaluateTriage({
      patientName: p.name,
      species: p.species,
      ageYears: p.ageYears,
      weightKg: p.weightKg,
      chiefComplaint: p.chiefComplaint,
      selectedSignIds: p.selectedSignIds,
      isDoubtful: p.isDoubtful,
    });
    setEvaluation(res);
    setViewMode('evaluacion');
  };

  const handleNewAdmission = () => {
    const nextNum = patientsQueue.length + 101;
    setPatientId(`ADM-${nextNum}`);
    setPatientName('Nuevo Paciente');
    setSpecies('Canino');
    setBreed('Mestizo');
    setAgeYears(3);
    setWeightKg(15);
    setChiefComplaint('');
    setSelectedSignIds([]);
    setIsDoubtful(false);
    setHeartRate(100);
    setRespiratoryRate(24);
    setTemperatureC(38.5);
    setMucousMembranes('Rosadas');
    setCrtSeconds(1.5);
    setMentalStatus('Alerta');
    setViewMode('evaluacion');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Clinical Header Bar */}
      <div className="bg-[#657166] rounded-2xl p-6 text-white border border-[#545E55] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#DAEBE3] text-[#2F614E]">
              <Stethoscope className="w-5 h-5 text-[#2F614E]" />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Estación de Admisión & Triaje Clínico Veterinario
              </h2>
              <span className="text-xs text-[#DAEBE3]">
                Servicio de Urgencias 24h · Protocolo Clínico Vet-Triage v2
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Mode */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 p-1 bg-[#535F54] rounded-xl border border-[#6F7C70]">
            <button
              onClick={() => setViewMode('evaluacion')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                viewMode === 'evaluacion'
                  ? 'bg-[#99CDD8] text-[#1D3D44] shadow-sm'
                  : 'text-[#DAEBE3] hover:text-white'
              }`}
            >
              Ficha de Evaluación Médica
            </button>
            <button
              onClick={() => setViewMode('cola')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                viewMode === 'cola'
                  ? 'bg-[#99CDD8] text-[#1D3D44] shadow-sm'
                  : 'text-[#DAEBE3] hover:text-white'
              }`}
            >
              Cola de Urgencias ({patientsQueue.length})
            </button>
          </div>

          <button
            onClick={handleNewAdmission}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#DAEBE3] text-[#2F614E] font-bold text-xs hover:bg-white transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nuevo Ingreso</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: Ficha de Evaluación Veterinaria */}
      {viewMode === 'evaluacion' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Columna Izquierda: Ficha Clínica del Paciente y Examen Primario */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white rounded-2xl p-6 border border-[#CFD6C4] shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAEFEA]">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-[#657166]" />
                  <h3 className="font-bold text-[#3D4A3E] text-sm sm:text-base">
                    Ficha de Ingreso y Filiación del Paciente
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#F4FAF7] text-[#2F614E] border border-[#DAEBE3]">
                  {patientId}
                </span>
              </div>

              {/* Datos de filiación */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="font-bold text-[#657166] block mb-1">Nombre</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F9F7] border border-[#CFD6C4] rounded-xl text-[#3D4A3E] focus:outline-none focus:border-[#99CDD8]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#657166] block mb-1">Especie</label>
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value as Species)}
                    className="w-full px-3 py-2 bg-[#F7F9F7] border border-[#CFD6C4] rounded-xl text-[#3D4A3E] focus:outline-none"
                  >
                    <option value="Canino">Canino</option>
                    <option value="Felino">Felino</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#657166] block mb-1">Edad (Años)</label>
                  <input
                    type="number"
                    value={ageYears}
                    onChange={(e) => setAgeYears(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F7F9F7] border border-[#CFD6C4] rounded-xl text-[#3D4A3E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#657166] block mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F7F9F7] border border-[#CFD6C4] rounded-xl text-[#3D4A3E] focus:outline-none"
                  />
                </div>
              </div>

              {/* Constantes Fisiológicas (Lo que mide y evalúa el veterinario) */}
              <div className="p-4 rounded-xl bg-[#F4FAF7] border border-[#DAEBE3] space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-[#DAEBE3]">
                  <Activity className="w-4 h-4 text-[#2F614E]" />
                  <span className="text-xs font-bold text-[#2F614E] uppercase tracking-wider">
                    Examen Primario de Urgencia (Constantes Fisiológicas)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-[#657166] block mb-0.5">FC (lat/min)</label>
                    <input
                      type="number"
                      value={heartRate}
                      onChange={(e) => setHeartRate(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#CFD6C4] rounded-lg text-[#3D4A3E]"
                      placeholder="Normal 70-140"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#657166] block mb-0.5">FR (resp/min)</label>
                    <input
                      type="number"
                      value={respiratoryRate}
                      onChange={(e) => setRespiratoryRate(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#CFD6C4] rounded-lg text-[#3D4A3E]"
                      placeholder="Normal 15-30"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#657166] block mb-0.5">Temperatura (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={temperatureC}
                      onChange={(e) => setTemperatureC(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#CFD6C4] rounded-lg text-[#3D4A3E]"
                      placeholder="Normal 38.0-39.2"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#657166] block mb-0.5">TLLC (segundos)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={crtSeconds}
                      onChange={(e) => setCrtSeconds(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#CFD6C4] rounded-lg text-[#3D4A3E]"
                      placeholder="Normal < 2s"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#657166] block mb-0.5">Mucosas</label>
                    <select
                      value={mucousMembranes}
                      onChange={(e) => setMucousMembranes(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#CFD6C4] rounded-lg text-[#3D4A3E]"
                    >
                      <option value="Rosadas">Rosadas (Normal)</option>
                      <option value="Pálidas">Pálidas (Anemia / Hipoperfusión)</option>
                      <option value="Cianóticas">Cianóticas (Hipoxia grave)</option>
                      <option value="Congestivas">Congestivas (Shock séptico)</option>
                      <option value="Ictéricas">Ictéricas (Hepático)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-[#657166] block mb-0.5">Estado Mental</label>
                    <select
                      value={mentalStatus}
                      onChange={(e) => setMentalStatus(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#CFD6C4] rounded-lg text-[#3D4A3E]"
                    >
                      <option value="Alerta">Alerta / Receptivo</option>
                      <option value="Deprimido">Deprimido / Apático</option>
                      <option value="Estuporoso">Estuporoso (Responde a dolor)</option>
                      <option value="Comatoso">Comatoso (Sin respuesta)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Motivo de consulta */}
              <div>
                <label className="font-bold text-[#657166] text-xs block mb-1">
                  Anamnesis y Motivo de Consulta Reportado
                </label>
                <textarea
                  rows={2}
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F9F7] border border-[#CFD6C4] rounded-xl text-xs text-[#3D4A3E] focus:outline-none"
                  placeholder="Descripción del incidente, evolución horaria y síntomas observados..."
                />
              </div>

              {/* Regla clínica precautoria */}
              <div className="p-3.5 rounded-xl bg-[#FFF9F3] border border-[#FDE8D3] flex items-start gap-3">
                <input
                  type="checkbox"
                  id="vetDoubtToggle"
                  checked={isDoubtful}
                  onChange={(e) => setIsDoubtful(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#8C5216] rounded border-[#CFD6C4] cursor-pointer"
                />
                <label htmlFor="vetDoubtToggle" className="text-xs text-[#4D594E] cursor-pointer select-none">
                  <strong className="block text-[#8C5216] font-bold mb-0.5">
                    Activar regla clínica precautoria: "Ante la duda, subir de nivel"
                  </strong>
                  Aplicar principio precautorio si el facultativo o el equipo observan signos limítrofes, comorbilidades no confirmadas o compromiso hemodinámico progresivo.
                </label>
              </div>

              {/* Matriz de los 22 Signos de Urgencia */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#3D4A3E] font-bold">
                  <span>Signos Clínicos Identificados ({selectedSignIds.length} activos):</span>
                  <button
                    type="button"
                    onClick={() => setSelectedSignIds([])}
                    className="text-[#657166] hover:text-[#3D4A3E] text-[11px] underline cursor-pointer"
                  >
                    Limpiar selección
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1.5 p-2 bg-[#F7F9F7] rounded-xl border border-[#CFD6C4]">
                  {URGENCY_SIGNS.map(sign => {
                    const isSelected = selectedSignIds.includes(sign.id);
                    return (
                      <div
                        key={sign.id}
                        onClick={() => handleToggleSign(sign.id)}
                        className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#DAEBE3] border-[#99CDD8] text-[#1D3D44] font-medium'
                            : 'bg-white border-[#EAEFEA] text-[#4D594E] hover:border-[#CFD6C4]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#3D4A3E]">{sign.name}</span>
                            <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                              sign.defaultLevel === 'Alto'
                                ? 'bg-[#F3C3B2] text-[#7D2A18]'
                                : sign.defaultLevel === 'Moderado'
                                ? 'bg-[#FDE8D3] text-[#8C5216]'
                                : 'bg-[#DAEBE3] text-[#2F614E]'
                            }`}>
                              Nivel {sign.defaultLevel}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#7A877B] mt-0.5">{sign.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunEvaluation}
                className="w-full py-3 rounded-xl bg-[#99CDD8] hover:bg-[#85BCC7] text-[#1D3D44] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all"
              >
                <Stethoscope className="w-4 h-4 text-[#1D3D44]" />
                <span>Emitir Dictamen de Triaje Clínico</span>
              </button>
            </div>
          </div>

          {/* Columna Derecha: Dictamen y Órdenes Médicas del Veterinario */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-[#CFD6C4] shadow-sm p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAEFEA]">
                <span className="text-xs font-bold text-[#657166] uppercase tracking-wider">
                  Dictamen Clínico de Admisión
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#F4FAF7] text-[#3D4A3E] border border-[#DAEBE3]">
                  {patientName} · {species} ({weightKg} kg)
                </span>
              </div>

              {/* Tarjeta de Nivel Asignado */}
              <div className={`p-5 rounded-2xl border ${
                evaluation.level === 'Alto'
                  ? 'bg-[#FDF0ED] border-[#F3C3B2]'
                  : evaluation.level === 'Moderado'
                  ? 'bg-[#FFF9F3] border-[#FDE8D3]'
                  : 'bg-[#F4FAF7] border-[#DAEBE3]'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#657166]">
                      Prioridad Médica
                    </span>
                    <h3 className="text-2xl font-extrabold text-[#3D4A3E] mt-0.5">
                      Nivel {evaluation.level.toUpperCase()}
                    </h3>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    evaluation.level === 'Alto'
                      ? 'bg-[#F3C3B2] text-[#7D2A18] border-[#E8A894]'
                      : evaluation.level === 'Moderado'
                      ? 'bg-[#FDE8D3] text-[#8C5216] border-[#F3CFAB]'
                      : 'bg-[#DAEBE3] text-[#2F614E] border-[#BDD9CE]'
                  }`}>
                    {evaluation.level === 'Alto' ? 'Emergencia Vital' : evaluation.level === 'Moderado' ? 'Urgencia Prioritaria' : 'No Urgente'}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-black/5 text-xs text-[#3D4A3E] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[#657166]">Tiempo de atención:</span>
                    <strong>{evaluation.recommendedWaitTime}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#657166]">Box Asignado:</span>
                    <strong>
                      {evaluation.level === 'Alto' ? 'Box 1 · Reanimación / UCI' : evaluation.level === 'Moderado' ? 'Box 2 · Procedimientos' : 'Consulta Ambulatoria'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Alerta de regla precautoria */}
              {evaluation.isEscalatedByPrecaution && (
                <div className="p-3 rounded-xl bg-[#FFF9F3] border border-[#FDE8D3] text-[#8C5216] text-xs">
                  <strong className="block font-bold">Regla precautoria aplicada:</strong>
                  "Ante la duda, subir de nivel". La urgencia fue elevada de nivel preventivamente para salvaguardar la vida del animal.
                </div>
              )}

              {/* Protocolo de Estabilización Inmediata (T-22) */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#3D4A3E] uppercase tracking-wide flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2F614E]" />
                  Protocolo de Estabilización Inmediata (T-22):
                </span>
                <div className="space-y-1.5">
                  {evaluation.immediateRecommendations.map((rec, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#CFD6C4] text-xs text-[#3D4A3E]">
                      {rec}
                    </div>
                  ))}
                </div>
              </div>

              {/* Protocolo de Escalamiento Clínico (T-23) */}
              <div className="space-y-2 pt-2 border-t border-[#EAEFEA]">
                <span className="text-xs font-bold text-[#3D4A3E] uppercase tracking-wide flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#7D2A18]" />
                  Protocolo de Escalamiento Hospitalario (T-23):
                </span>
                <div className="space-y-1.5">
                  {evaluation.escalationSteps.map((step, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-[#FDF0ED] border border-[#F3C3B2] text-xs text-[#7D2A18] font-medium">
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              {/* Declaración de limitaciones */}
              {evaluation.limitationsNoted.length > 0 && (
                <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#CFD6C4] text-[11px] text-[#657166] space-y-1">
                  <strong className="block text-[#3D4A3E]">Notas de Limitación Metodológica (Alcance sin veterinario presencial):</strong>
                  {evaluation.limitationsNoted.map((lim, idx) => (
                    <div key={idx}>• {lim}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Monitor de Cola de Urgencias (Lo que ve el veterinario en la central) */}
      {viewMode === 'cola' && (
        <div className="bg-white rounded-2xl border border-[#CFD6C4] shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAEFEA]">
            <div>
              <h3 className="text-base font-bold text-[#3D4A3E]">
                Monitor de Pacientes en Espera de Urgencias
              </h3>
              <p className="text-xs text-[#7A877B]">
                Ordenados por nivel de prioridad médica y tiempo de arribo.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full font-bold bg-[#F3C3B2] text-[#7D2A18]">
                Alto: {patientsQueue.filter(p => p.selectedSignIds.some(s => ['s-01','s-02','s-03','s-06','s-07','s-21'].includes(s))).length}
              </span>
              <span className="px-2.5 py-1 rounded-full font-bold bg-[#FDE8D3] text-[#8C5216]">
                Moderado: {patientsQueue.filter(p => p.selectedSignIds.includes('s-15')).length}
              </span>
              <span className="px-2.5 py-1 rounded-full font-bold bg-[#DAEBE3] text-[#2F614E]">
                Bajo: {patientsQueue.filter(p => p.selectedSignIds.includes('s-22')).length}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#CFD6C4] bg-[#F7F9F7] text-[#657166] font-bold">
                  <th className="py-3 px-3">ID</th>
                  <th className="py-3 px-3">Paciente & Especie</th>
                  <th className="py-3 px-3">Constantes Clave</th>
                  <th className="py-3 px-3 min-w-[220px]">Motivo de Urgencia</th>
                  <th className="py-3 px-3 text-center">Prioridad</th>
                  <th className="py-3 px-3">Box Asignado</th>
                  <th className="py-3 px-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEFEA] text-[#3D4A3E]">
                {patientsQueue.map(p => {
                  const evalItem = evaluateTriage({
                    patientName: p.name,
                    species: p.species,
                    ageYears: p.ageYears,
                    chiefComplaint: p.chiefComplaint,
                    selectedSignIds: p.selectedSignIds,
                    isDoubtful: p.isDoubtful,
                  });

                  return (
                    <tr key={p.id} className="hover:bg-[#F4FAF7] transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#657166]">{p.id}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-[#3D4A3E]">{p.name}</div>
                        <div className="text-[11px] text-[#7A877B]">{p.species} · {p.breed} ({p.weightKg} kg)</div>
                      </td>
                      <td className="py-3 px-3 text-xs">
                        <div>FC: <strong>{p.heartRate}</strong> | FR: <strong>{p.respiratoryRate}</strong></div>
                        <div className="text-[11px] text-[#7A877B]">T: {p.temperatureC}°C | TLLC: {p.crtSeconds}s</div>
                      </td>
                      <td className="py-3 px-3 text-xs text-[#4D594E]">
                        <span className="line-clamp-2">{p.chiefComplaint}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          evalItem.level === 'Alto'
                            ? 'bg-[#F3C3B2] text-[#7D2A18] border-[#E8A894]'
                            : evalItem.level === 'Moderado'
                            ? 'bg-[#FDE8D3] text-[#8C5216] border-[#F3CFAB]'
                            : 'bg-[#DAEBE3] text-[#2F614E] border-[#BDD9CE]'
                        }`}>
                          Nivel {evalItem.level}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-xs text-[#3D4A3E]">{p.assignedBox}</td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleSelectPatientFromQueue(p)}
                          className="px-2.5 py-1 rounded-lg bg-[#99CDD8] hover:bg-[#85BCC7] text-[#1D3D44] font-bold text-xs cursor-pointer transition-colors"
                        >
                          Atender Ficha
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
