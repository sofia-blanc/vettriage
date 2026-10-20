/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  Info,
  Tag,
  Stethoscope
} from 'lucide-react';
import { SAMPLE_CASES, ClinicalCase } from '../data/reportData';

interface DatasetExplorerViewProps {
  onLoadCaseInSimulator: (c: ClinicalCase) => void;
}

export const DatasetExplorerView: React.FC<DatasetExplorerViewProps> = ({ onLoadCaseInSimulator }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('Todas');
  const [selectedLevel, setSelectedLevel] = useState('Todos');
  const [selectedSource, setSelectedSource] = useState('Todas');

  const filteredCases = useMemo(() => {
    return SAMPLE_CASES.filter(c => {
      const matchesSearch = 
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.ruleApplied.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.signsPresent.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSpecies = selectedSpecies === 'Todas' || c.species === selectedSpecies;
      const matchesLevel = selectedLevel === 'Todos' || c.assignedLevel === selectedLevel;
      const matchesSource = selectedSource === 'Todas' || c.source.includes(selectedSource);

      return matchesSearch && matchesSpecies && matchesLevel && matchesSource;
    });
  }, [searchQuery, selectedSpecies, selectedLevel, selectedSource]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Overview Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Database className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Explorador del Dataset Clínico (138 Casos)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            Trazabilidad por fuente de los 138 casos (71 de D1 y 67 de D2 sintético). 29 de nivel Alto (21%), 94 Moderado (68%) y 15 Bajo (11%). Contraste de etiquetas realizado en T-11 y limpieza en T-12.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200">
            D1 Reales: 71
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 font-semibold text-xs border border-purple-200">
            D2 Sintéticos: 67
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por síntoma (ej. convulsión, hematemesis, orina), ID o motivo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Especie:</span>
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="Todas">Todas</option>
              <option value="Canino">Canino</option>
              <option value="Felino">Felino</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Nivel de Urgencia:</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="Todos">Todos</option>
              <option value="Alto">Alto (Emergencia)</option>
              <option value="Moderado">Moderado</option>
              <option value="Bajo">Bajo</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Fuente:</span>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="Todas">Todas</option>
              <option value="D1">D1 (Casos Reales)</option>
              <option value="D2">D2 (Sintético Ampliado)</option>
            </select>
          </div>

          <div className="ml-auto text-slate-500">
            Casos mostrados: <strong>{filteredCases.length}</strong>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3 px-4 w-24">ID Caso</th>
                <th className="py-3 px-4">Especie & Edad</th>
                <th className="py-3 px-4">Fuente</th>
                <th className="py-3 px-4 min-w-[280px]">Motivo de Consulta y Signos</th>
                <th className="py-3 px-4 text-center">Nivel Asignado</th>
                <th className="py-3 px-4 min-w-[200px]">Regla Clínica Aplicada</th>
                <th className="py-3 px-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCases.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {c.id}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{c.species}</div>
                    <div className="text-[11px] text-slate-500">{c.ageDisplay}</div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                      c.source.includes('D1')
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                    }`}>
                      {c.source.includes('D1') ? 'D1 (Real)' : 'D2 (Sintético)'}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-medium text-slate-900 mb-1">{c.chiefComplaint}</p>
                    <div className="flex flex-wrap gap-1">
                      {c.signsPresent.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      c.assignedLevel === 'Alto'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : c.assignedLevel === 'Moderado'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {c.assignedLevel}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-xs text-slate-600">
                    <span className="line-clamp-2">{c.ruleApplied}</span>
                  </td>

                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => onLoadCaseInSimulator(c)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold border border-teal-200 cursor-pointer transition-colors"
                      title="Cargar caso en el simulador clínico"
                    >
                      <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                      <span>Simular</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
