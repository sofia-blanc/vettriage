/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Database, 
  ShieldAlert, 
  CheckCircle2, 
  FileSpreadsheet, 
  Scale, 
  Layers, 
  BookOpen, 
  Info,
  Filter
} from 'lucide-react';
import { 
  RISKS_MATRIX_V2, 
  DEVIATIONS_LIST,
  RiskItem 
} from '../data/reportData';
import { URGENCY_SIGNS } from '../utils/triageRules';

export const RisksAndDataQualityView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'riesgos' | 'datos' | 'signos' | 'desviaciones'>('riesgos');
  const [selectedRiskCategory, setSelectedRiskCategory] = useState<string>('Todas');
  const [selectedSignCategory, setSelectedSignCategory] = useState<string>('Todas');

  const filteredRisks = RISKS_MATRIX_V2.filter(r => 
    selectedRiskCategory === 'Todas' || r.category === selectedRiskCategory
  );

  const filteredSigns = URGENCY_SIGNS.filter(s => {
    if (selectedSignCategory === 'Todas') return true;
    return s.category === selectedSignCategory;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and Sub-Navigation */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Gestión de Riesgos & Auditoría de Calidad de Datos
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            Control de los 12 riesgos ajustados en versión 2 (sin veterinario), matriz de datos de 138 casos, tabla de los 22 signos clínicos y seguimiento de desviaciones del comité.
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('riesgos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeSubTab === 'riesgos'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Matriz de Riesgos v2 (12)
          </button>
          <button
            onClick={() => setActiveSubTab('datos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeSubTab === 'datos'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Auditoría de Datos (138 Casos)
          </button>
          <button
            onClick={() => setActiveSubTab('signos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeSubTab === 'signos'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            22 Signos de Urgencia
          </button>
          <button
            onClick={() => setActiveSubTab('desviaciones')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeSubTab === 'desviaciones'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Desviaciones del Comité (5)
          </button>
        </div>
      </div>

      {/* SUBTAB 1: Matriz de Riesgos */}
      {activeSubTab === 'riesgos' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Filtrar por categoría:</span>
              {['Todas', 'Datos', 'Clínico', 'Cronograma', 'Integración'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedRiskCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    selectedRiskCategory === cat
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="text-slate-500">
              Mostrando {filteredRisks.length} de {RISKS_MATRIX_V2.length} riesgos
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRisks.map(risk => (
              <div 
                key={risk.id}
                className={`p-5 rounded-2xl bg-white border transition-all ${
                  risk.isCritical 
                    ? 'border-rose-300 shadow-sm shadow-rose-100 ring-1 ring-rose-200' 
                    : 'border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-slate-100 text-slate-800 border border-slate-300">
                      {risk.id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                      {risk.category}
                    </span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    risk.status === 'Vigente'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : risk.status === 'Mitigado'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {risk.status}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm mb-2">
                  {risk.name}
                </h4>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-center mb-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Probabilidad</span>
                    <span className="font-semibold text-slate-800">{risk.probability}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Impacto</span>
                    <span className="font-semibold text-slate-800">{risk.impact}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Severidad</span>
                    <span className={`font-bold ${
                      risk.level === 'Alto' ? 'text-rose-600' : risk.level === 'Medio' ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {risk.level}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 bg-blue-50/40 p-3 rounded-xl border border-blue-100">
                  <strong className="text-slate-800 block mb-0.5">Estrategia de Mitigación / Control:</strong>
                  {risk.mitigation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: Auditoría de Datos */}
      {activeSubTab === 'datos' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Composición del Dataset
              </span>
              <div className="text-3xl font-extrabold text-slate-900 mb-2">138 Casos</div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between p-2 rounded bg-slate-50">
                  <span>D1 (Casos Reales):</span>
                  <strong className="text-slate-900 font-bold">71 casos (51,4%)</strong>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-50">
                  <span>D2 (Sintético Ampliado):</span>
                  <strong className="text-slate-900 font-bold">67 casos (48,6%)</strong>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Balance de Clases de Urgencia
              </span>
              <div className="text-3xl font-extrabold text-amber-600 mb-2">Desbalanceado</div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between p-1.5 rounded bg-rose-50 text-rose-800 font-medium">
                  <span>Alto (Emergencia):</span>
                  <span className="font-bold">29 casos (21%)</span>
                </div>
                <div className="flex justify-between p-1.5 rounded bg-amber-50 text-amber-900 font-medium">
                  <span>Moderado (Urgencia):</span>
                  <span className="font-bold">94 casos (68%)</span>
                </div>
                <div className="flex justify-between p-1.5 rounded bg-emerald-50 text-emerald-800 font-medium">
                  <span>Bajo (No urgente):</span>
                  <span className="font-bold">15 casos (11%) *Solo de D2</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Calidad y Problemas Resueltos
              </span>
              <div className="text-3xl font-extrabold text-emerald-600 mb-2">17 / 30</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                17 problemas resueltos (2 por validar), 2 parciales, 11 pendientes a cerrar antes de T-14. Tratamiento de 71 edades en blanco estructurado en T-10.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Tratamiento de Datos y Línea Base del Comité (29-sep vs T-10 a T-12)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-2.5 px-3">Elemento</th>
                    <th className="py-2.5 px-3">Línea base (29-sep)</th>
                    <th className="py-2.5 px-3">Estrategia / Tratamiento Aplicado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Tamaño de la base</td>
                    <td className="py-2.5 px-3 text-slate-600">138 casos (71 D1 y 67 D2)</td>
                    <td className="py-2.5 px-3 text-slate-800">Limpieza de duplicados y trazabilidad estricta por fuente (T-10 a T-12).</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Balance de clases</td>
                    <td className="py-2.5 px-3 text-slate-600">Alto 29 (21%), Moderado 94 (68%), Bajo 15 (11%)</td>
                    <td className="py-2.5 px-3 text-slate-800">Pesos por clase en el entrenamiento y validación cruzada estratificada; casos sintéticos marcados.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Edad en blanco</td>
                    <td className="py-2.5 px-3 text-slate-600">En blanco en 71 casos de D1</td>
                    <td className="py-2.5 px-3 text-slate-800">Tratamiento definido en T-10 con imputación por categoría y especie.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Etiquetas</td>
                    <td className="py-2.5 px-3 text-slate-600">138 casos con reglas asignadas</td>
                    <td className="py-2.5 px-3 text-slate-800">Contraste completo de las reglas contra la tabla de signos ejecutado en T-11.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Signos de urgencia</td>
                    <td className="py-2.5 px-3 text-slate-600">22 signos en total</td>
                    <td className="py-2.5 px-3 text-slate-800">12 sólidos, 8 con umbral por contrastar, 1 en conflicto (hematemesis), 1 sin fuente; regla "ante la duda, subir de nivel".</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: 22 Signos de Urgencia */}
      {activeSubTab === 'signos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Filtrar por respaldo científico:</span>
              {[
                { label: 'Todos (22)', val: 'Todas' },
                { label: 'Sólidos (12)', val: 'sólido' },
                { label: 'Umbral por contrastar (8)', val: 'umbral_por_contrastar' },
                { label: 'En conflicto (1)', val: 'en_conflicto' },
                { label: 'Sin fuente (1)', val: 'sin_fuente' },
              ].map(item => (
                <button
                  key={item.val}
                  onClick={() => setSelectedSignCategory(item.val)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    selectedSignCategory === item.val
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredSigns.map(sign => (
              <div 
                key={sign.id} 
                className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-slate-100 text-slate-800">
                      {sign.code}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      sign.defaultLevel === 'Alto'
                        ? 'bg-rose-100 text-rose-800'
                        : sign.defaultLevel === 'Moderado'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      Nivel {sign.defaultLevel}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                    sign.category === 'sólido'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : sign.category === 'umbral_por_contrastar'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : sign.category === 'en_conflicto'
                      ? 'bg-rose-50 text-rose-700 border-rose-200 font-bold'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}>
                    {sign.category === 'sólido' ? 'Sólido (13 fuentes)' :
                     sign.category === 'umbral_por_contrastar' ? 'Umbral a contrastar' :
                     sign.category === 'en_conflicto' ? 'En conflicto' : 'Sin fuente (limitación)'}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm">
                  {sign.name}
                </h4>

                <p className="text-xs text-slate-600">
                  {sign.description}
                </p>

                {sign.thresholdNote && (
                  <div className="text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-200 text-slate-700">
                    <strong>Criterio umbral:</strong> {sign.thresholdNote}
                  </div>
                )}

                {sign.escalationRule && (
                  <div className="text-[11px] bg-[#FFF9F3] p-2 rounded-lg border border-[#FDE8D3] text-[#8C5216] font-medium">
                    <strong className="block text-[#8C5216]">Regla de escalamiento:</strong> {sign.escalationRule}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: Desviaciones del Comité */}
      {activeSubTab === 'desviaciones' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              Desviaciones Identificadas en el Comité y su Control Vigente
            </h3>

            <div className="space-y-3">
              {DEVIATIONS_LIST.map(dev => (
                <div key={dev.number} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {dev.number}
                      </span>
                      <strong className="text-sm font-bold text-slate-900">{dev.deviation}</strong>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${dev.stateColor}`}>
                      {dev.state}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="font-semibold text-slate-500 block">Situación al 12-oct:</span>
                      <span className="text-slate-800">{dev.situation}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="font-semibold text-slate-500 block">Mecanismo de Control:</span>
                      <span className="text-slate-800">{dev.control}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
