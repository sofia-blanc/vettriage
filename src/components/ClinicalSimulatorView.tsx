/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { 
  Stethoscope, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Send, 
  Bot, 
  User, 
  FileText,
  Bookmark
} from 'lucide-react';
import { 
  evaluateTriage, 
  URGENCY_SIGNS, 
  Species, 
  TriageInput, 
  TriageEvaluation, 
  UrgencySign 
} from '../utils/triageRules';

export const ClinicalSimulatorView: React.FC = () => {
  // Input State
  const [species, setSpecies] = useState<Species>('Canino');
  const [patientName, setPatientName] = useState('Max');
  const [ageYears, setAgeYears] = useState<number | ''>(4);
  const [chiefComplaint, setChiefComplaint] = useState('Dificultad respiratoria súbita y mucosas azuladas');
  const [selectedSignIds, setSelectedSignIds] = useState<string[]>(['s-01']);
  const [isDoubtful, setIsDoubtful] = useState(false);
  const [mode, setMode] = useState<'formulario' | 'chatbot'>('formulario');

  // Evaluation Result
  const [evaluation, setEvaluation] = useState<TriageEvaluation | null>(() => {
    return evaluateTriage({
      patientName: 'Max',
      species: 'Canino',
      ageYears: 4,
      chiefComplaint: 'Dificultad respiratoria súbita y mucosas azuladas',
      selectedSignIds: ['s-01'],
      isDoubtful: false,
    });
  });

  // Chatbot conversation state (for T-20 to T-23 conversational flow)
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: '¡Hola! Soy el asistente de triaje Vet-Triage. Estoy aquí para ayudarte a clasificar la urgencia de tu perro o gato según los 22 signos clínicos de referencia y los protocolos de Sara, Cristóbal y Julián.',
      time: '12:00',
    },
    {
      sender: 'bot',
      text: 'Indícame la especie del paciente, su edad aproximada y qué síntomas o cambios de comportamiento estás observando.',
      time: '12:01',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleToggleSign = (signId: string) => {
    setSelectedSignIds(prev => 
      prev.includes(signId) ? prev.filter(id => id !== signId) : [...prev, signId]
    );
  };

  const handleRunEvaluation = () => {
    const input: TriageInput = {
      patientName: patientName || 'Paciente',
      species,
      ageYears: ageYears === '' ? null : Number(ageYears),
      chiefComplaint,
      selectedSignIds,
      isDoubtful,
    };
    const res = evaluateTriage(input);
    setEvaluation(res);
  };

  const handleLoadPreset = (preset: {
    name: string;
    species: Species;
    age: number | '';
    complaint: string;
    signs: string[];
    doubtful: boolean;
  }) => {
    setPatientName(preset.name);
    setSpecies(preset.species);
    setAgeYears(preset.age);
    setChiefComplaint(preset.complaint);
    setSelectedSignIds(preset.signs);
    setIsDoubtful(preset.doubtful);

    const res = evaluateTriage({
      patientName: preset.name,
      species: preset.species,
      ageYears: preset.age === '' ? null : Number(preset.age),
      chiefComplaint: preset.complaint,
      selectedSignIds: preset.signs,
      isDoubtful: preset.doubtful,
    });
    setEvaluation(res);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { sender: 'user', text: userText, time: now }]);
    setChatInput('');

    // Chatbot intent matching using project triage rules
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let matchedSignIds: string[] = [];
      let detectedSpecies: Species = species;

      if (lower.includes('gato') || lower.includes('felino') || lower.includes('michi')) {
        detectedSpecies = 'Felino';
        setSpecies('Felino');
      } else if (lower.includes('perro') || lower.includes('canino')) {
        detectedSpecies = 'Canino';
        setSpecies('Canino');
      }

      // Match common symptom tokens
      if (lower.includes('respira') || lower.includes('ahogo') || lower.includes('cianosis') || lower.includes('morad')) {
        matchedSignIds.push('s-01');
      }
      if (lower.includes('orina') || lower.includes('arenero') || lower.includes('bloqueo') || lower.includes('tapa')) {
        matchedSignIds.push(detectedSpecies === 'Felino' ? 's-07' : 's-20');
      }
      if (lower.includes('sangre') || lower.includes('hematemesis')) {
        matchedSignIds.push('s-21'); // Vómito con sangre -> elevated
      }
      if (lower.includes('panza') || lower.includes('abdomen') || lower.includes('inflad') || lower.includes('torsion')) {
        matchedSignIds.push('s-06');
      }
      if (lower.includes('convulsi')) {
        matchedSignIds.push('s-03');
      }
      if (lower.includes('diarrea') && matchedSignIds.length === 0) {
        matchedSignIds.push('s-22');
      }

      const evalRes = evaluateTriage({
        patientName,
        species: detectedSpecies,
        chiefComplaint: userText,
        selectedSignIds: matchedSignIds.length > 0 ? matchedSignIds : selectedSignIds,
        isDoubtful: lower.includes('duda') || lower.includes('no sé') || lower.includes('raro'),
      });
      setEvaluation(evalRes);

      let reply = `He procesado los signos para tu ${detectedSpecies.toLowerCase()}.\n\n`;
      reply += `🎯 **Nivel Asignado: ${evalRes.level.toUpperCase()}**\n`;
      reply += `⏱️ **Tiempo de atención recomendado:** ${evalRes.recommendedWaitTime}\n\n`;
      if (evalRes.isEscalatedByPrecaution) {
        reply += `⚠️ **Regla Aplicada:** Se elevó el nivel de urgencia por el principio "Ante la duda, subir de nivel".\n\n`;
      }
      reply += `📋 **Recomendaciones inmediatas:**\n` + evalRes.immediateRecommendations.slice(0, 2).join('\n');

      setChatMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 rounded-2xl p-6 border border-teal-700/50 shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Stethoscope className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">
              Simulador Clínico & Chatbot Vet-Triage
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
            Implementación interactiva de las tareas T-20 a T-23 (diseño de flujo, cuestionario, recomendaciones y escalamiento). Aplica la regla precautoria del comité:{' '}
            <strong className="text-teal-300">"Ante la duda, subir de nivel"</strong>.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-xl border border-slate-700 shrink-0">
          <button
            onClick={() => setMode('formulario')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'formulario' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Modo Formulario Clínico
          </button>
          <button
            onClick={() => setMode('chatbot')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'chatbot' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Modo Chatbot Guiado
          </button>
        </div>
      </div>

      {/* Quick Case Presets */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
          <Bookmark className="w-3.5 h-3.5 text-blue-600" />
          Cargar Casos Rápidos de Prueba (Casos Clave del Proyecto):
        </span>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => handleLoadPreset({
              name: 'Thor',
              species: 'Canino',
              age: 7,
              complaint: 'Gran Danés con abdomen timpanítico y arcadas no productivas tras comer',
              signs: ['s-06'],
              doubtful: false,
            })}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
          >
            🔴 Perro: Sospecha Torsión Gástrica (Alto)
          </button>

          <button
            onClick={() => handleLoadPreset({
              name: 'Milo',
              species: 'Felino',
              age: 3,
              complaint: 'Gato macho maullando dolorosamente en la caja de arena sin emitir orina',
              signs: ['s-07', 's-14'],
              doubtful: false,
            })}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
          >
            🔴 Gato: Obstrucción Uretral (Alto)
          </button>

          <button
            onClick={() => handleLoadPreset({
              name: 'Rocky',
              species: 'Canino',
              age: 5,
              complaint: 'Vómito con estrías de sangre (Hematemesis). Dueño muy angustiado.',
              signs: ['s-21'],
              doubtful: true,
            })}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300 transition-colors cursor-pointer"
          >
            ⚠️ Perro: Hematemesis ("Ante la duda, subir de nivel")
          </button>

          <button
            onClick={() => handleLoadPreset({
              name: 'Luna',
              species: 'Canino',
              age: 2,
              complaint: 'Vómitos continuos (4 veces en 10 horas) pero encías rosadas y alerta',
              signs: ['s-15'],
              doubtful: false,
            })}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
          >
            🟡 Perro: Vómitos repetidos (Moderado)
          </button>

          <button
            onClick={() => handleLoadPreset({
              name: 'Toby',
              species: 'Canino',
              age: 3,
              complaint: 'Diarrea blanda matutina única tras cambio de comida, alegre y sin vómito',
              signs: ['s-22'],
              doubtful: false,
            })}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
          >
            🟢 Perro: Diarrea aislada (Bajo)
          </button>
        </div>
      </div>

      {/* Main Grid: Input Form vs Diagnostic Outcome */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form OR Chatbot */}
        <div className="lg:col-span-7 space-y-5">
          {mode === 'formulario' ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  Datos del Paciente y Evaluación de Signos
                </h3>
                <span className="text-xs text-slate-500">T-21 Implementación de preguntas</span>
              </div>

              {/* Patient Basics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Nombre</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    placeholder="Ej. Max"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Especie</label>
                  <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setSpecies('Canino')}
                      className={`py-1.5 text-xs font-bold rounded-lg cursor-pointer ${
                        species === 'Canino' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
                      }`}
                    >
                      🐶 Canino
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpecies('Felino')}
                      className={`py-1.5 text-xs font-bold rounded-lg cursor-pointer ${
                        species === 'Felino' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'
                      }`}
                    >
                      🐱 Felino
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Edad (Años)</label>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    value={ageYears}
                    onChange={(e) => setAgeYears(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    placeholder="Edad"
                  />
                </div>
              </div>

              {/* Chief complaint */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Motivo de consulta reportado por el tutor
                </label>
                <textarea
                  rows={2}
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="Describe qué le pasa a la mascota..."
                />
              </div>

              {/* Precautionary toggle: "Ante la duda, subir de nivel" */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="doubtfulToggle"
                  checked={isDoubtful}
                  onChange={(e) => setIsDoubtful(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-amber-600 rounded focus:ring-amber-500 border-slate-300 cursor-pointer"
                />
                <label htmlFor="doubtfulToggle" className="text-xs text-slate-800 cursor-pointer select-none">
                  <strong className="block text-amber-900 font-bold mb-0.5">
                    Activar regla: "Ante la duda, subir de nivel"
                  </strong>
                  Marcar si el operador, tutor o clínico percibe dudas diagnósticas, signos limítrofes o el estado general del animal parece más comprometido.
                </label>
              </div>

              {/* Sign selection list (22 signs grouped) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-700 font-semibold">
                  <span>Seleccionar Signos Clínicos Presentes ({selectedSignIds.length} marcados):</span>
                  <button
                    type="button"
                    onClick={() => setSelectedSignIds([])}
                    className="text-slate-500 hover:text-slate-800 text-[11px] underline cursor-pointer"
                  >
                    Desmarcar todos
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {URGENCY_SIGNS.map(sign => {
                    const isSelected = selectedSignIds.includes(sign.id);
                    return (
                      <div
                        key={sign.id}
                        onClick={() => handleToggleSign(sign.id)}
                        className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-blue-50 border-blue-400 text-slate-900 font-medium'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // handled by div
                          className="mt-0.5 rounded text-blue-600"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-900">{sign.name}</span>
                            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              sign.defaultLevel === 'Alto' ? 'bg-rose-100 text-rose-700' :
                              sign.defaultLevel === 'Moderado' ? 'bg-amber-100 text-amber-800' :
                              'bg-emerald-100 text-emerald-800'
                            }`}>
                              {sign.defaultLevel}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{sign.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunEvaluation}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4 text-teal-200" />
                <span>Ejecutar Algoritmo de Triaje Clínico</span>
              </button>
            </div>
          ) : (
            /* Chatbot Interactive Mode */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px]">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Vet-Triage Bot (T-20 a T-23)</h4>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> En línea
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setChatMessages([
                    {
                      sender: 'bot',
                      text: '¡Conversación reiniciada! ¿Cuál es la especie y qué síntomas observas en el animal?',
                      time: '12:00',
                    }
                  ])}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reiniciar
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 shadow-sm whitespace-pre-line leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-slate-100 text-slate-900 rounded-tl-none border border-slate-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChatMessage} className="p-3 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  placeholder="Escribe los síntomas (ej. 'Mi perro vomita sangre' o 'Gato no puede orinar')..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-slate-900"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Diagnostic Output Card */}
        <div className="lg:col-span-5 space-y-4">
          {evaluation ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Dictamen de Triaje Clínico
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {patientName} · {species}
                </span>
              </div>

              {/* Triage Level Big Banner */}
              <div className={`p-5 rounded-2xl border ${
                evaluation.level === 'Alto'
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : evaluation.level === 'Moderado'
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-950'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider block opacity-75">
                      Prioridad Asignada
                    </span>
                    <h3 className="text-2xl font-black tracking-tight mt-0.5">
                      Nivel {evaluation.level.toUpperCase()}
                    </h3>
                  </div>

                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg text-white shadow ${
                    evaluation.level === 'Alto' ? 'bg-rose-600' : evaluation.level === 'Moderado' ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}>
                    {evaluation.level === 'Alto' ? '1' : evaluation.level === 'Moderado' ? '2' : '3'}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-black/10 flex items-center gap-2 text-xs font-semibold">
                  <Clock className="w-4 h-4" />
                  <span>Tiempo máx. de atención: <strong>{evaluation.recommendedWaitTime}</strong></span>
                </div>
              </div>

              {/* Precautionary escalation badge */}
              {evaluation.isEscalatedByPrecaution && (
                <div className="p-3 rounded-xl bg-amber-100/70 border border-amber-300 text-amber-900 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Regla del comité activada:</strong>
                    "Ante la duda, subir de nivel". El nivel fue elevado preventivamente para salvaguardar la vida del paciente.
                  </div>
                </div>
              )}

              {/* Rules Applied */}
              {evaluation.rulesApplied.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                    Reglas de Decisión Aplicadas:
                  </span>
                  {evaluation.rulesApplied.map((rule, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800">
                      ⚖️ {rule}
                    </div>
                  ))}
                </div>
              )}

              {/* Recommendations (T-22) */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Recomendaciones Inmediatas (T-22):
                </span>
                <div className="space-y-1.5">
                  {evaluation.immediateRecommendations.map((rec, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800">
                      {rec}
                    </div>
                  ))}
                </div>
              </div>

              {/* Escalation protocol (T-23) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-600" />
                  Protocolo de Escalamiento (T-23):
                </span>
                <div className="space-y-1.5">
                  {evaluation.escalationSteps.map((step, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-rose-50/50 border border-rose-200 text-xs text-rose-900 font-medium">
                      → {step}
                    </div>
                  ))}
                </div>
              </div>

              {/* Methodological limitations noted */}
              {evaluation.limitationsNoted.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <strong className="block text-slate-700">Declaración de Limitaciones (Sin veterinario presencial):</strong>
                  {evaluation.limitationsNoted.map((lim, idx) => (
                    <div key={idx}>• {lim}</div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
              Selecciona datos a la izquierda o prueba uno de los casos predefinidos para ver el triaje.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
