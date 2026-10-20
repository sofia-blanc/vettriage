/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Flame, 
  User, 
  FileCheck,
  ChevronDown,
  Info
} from 'lucide-react';
import { TASKS_LIST, TaskItem } from '../data/reportData';

export const GanttScheduleView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<string>('Todas');
  const [selectedResponsible, setSelectedResponsible] = useState<string>('Todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  const phases = ['Todas', '1. Iniciación', '2. Planeación', '3. Ejecución', '4. Seguimiento y control', '5. Cierre'];
  const responsibles = ['Todos', 'Julián', 'Cristóbal', 'Sara'];
  const statuses = ['Todos', 'Completada', 'En curso', 'Próxima'];

  const filteredTasks = useMemo(() => {
    return TASKS_LIST.filter(task => {
      const matchesSearch = 
        task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.evidence.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPhase = selectedPhase === 'Todas' || task.phase === selectedPhase;
      const matchesResponsible = selectedResponsible === 'Todos' || task.responsible === selectedResponsible;
      const matchesStatus = selectedStatus === 'Todos' || task.status === selectedStatus;
      const matchesCritical = !showCriticalOnly || task.isCriticalPath;

      return matchesSearch && matchesPhase && matchesResponsible && matchesStatus && matchesCritical;
    });
  }, [searchQuery, selectedPhase, selectedResponsible, selectedStatus, showCriticalOnly]);

  const stats = useMemo(() => {
    const total = TASKS_LIST.length;
    const completed = TASKS_LIST.filter(t => t.status === 'Completada').length;
    const inProgress = TASKS_LIST.filter(t => t.status === 'En curso').length;
    const upcoming = TASKS_LIST.filter(t => t.status === 'Próxima').length;
    const critical = TASKS_LIST.filter(t => t.isCriticalPath).length;
    return { total, completed, inProgress, upcoming, critical };
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner / Explanation */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Calendar className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Cronograma Oficial & Ruta Crítica (39 Tareas)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            Línea de base al 12 de octubre de 2026 (Día 35 de 87). Las 16 tareas vencidas están cerradas al 100%. T-13 está en curso cerrando el 13 de octubre. La ruta crítica no tiene holgura hasta el cierre del 3 de diciembre.
          </p>
        </div>

        {/* Quick status counters */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center">
            <span className="block text-base font-bold">{stats.completed}</span>
            <span>Completadas</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold text-center">
            <span className="block text-base font-bold">{stats.inProgress}</span>
            <span>En curso</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold text-center">
            <span className="block text-base font-bold">{stats.upcoming}</span>
            <span>Próximas</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por ID (ej. T-13), nombre de tarea o entregable..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
            />
          </div>

          <button
            onClick={() => setShowCriticalOnly(!showCriticalOnly)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0 border ${
              showCriticalOnly
                ? 'bg-rose-600 text-white border-rose-700 shadow-sm'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}
          >
            <Flame className="w-4 h-4 text-rose-500" />
            <span>Ruta Crítica ({stats.critical} tareas)</span>
          </button>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Fase:</span>
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {phases.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Responsable:</span>
            <select
              value={selectedResponsible}
              onChange={(e) => setSelectedResponsible(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {responsibles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Estado:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="ml-auto text-slate-500">
            Mostrando <strong>{filteredTasks.length}</strong> de <strong>{TASKS_LIST.length}</strong> tareas
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3 px-4 w-20">ID</th>
                <th className="py-3 px-4 min-w-[240px]">Tarea</th>
                <th className="py-3 px-4">Fase</th>
                <th className="py-3 px-4">Responsable</th>
                <th className="py-3 px-4">Fechas Gantt</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 min-w-[200px]">Evidencia / Entregable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTasks.map(task => {
                const isCurrent = task.id === 'T-13';
                return (
                  <tr 
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${
                      isCurrent ? 'bg-amber-50/60 font-medium' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 flex items-center gap-1.5">
                      {task.id}
                      {task.isCriticalPath && (
                        <span title="Tarea en Ruta Crítica (sin holgura)">
                          <Flame className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{task.name}</div>
                      {task.notes && (
                        <div className="text-[11px] text-slate-500 mt-0.5">{task.notes}</div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-xs text-slate-600 whitespace-nowrap">
                      {task.phase}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                        task.responsible === 'Julián'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : task.responsible === 'Cristóbal'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <User className="w-3 h-3" />
                        {task.responsible}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-xs text-slate-600">
                      {task.dates}
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {task.status === 'Completada' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Completada
                        </span>
                      )}
                      {task.status === 'En curso' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 animate-pulse">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          En curso
                        </span>
                      )}
                      {task.status === 'Próxima' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          Próxima
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-xs text-slate-600">
                      <span className="line-clamp-2">{task.evidence}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-mono font-bold text-sm">
                  {selectedTask.id}
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {selectedTask.phase}
                </span>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">{selectedTask.name}</h3>
              {selectedTask.isCriticalPath && (
                <div className="mt-1.5 flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  Tarea crítica en la cadena de entregas (Holgura = 0 días)
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block">Responsable:</span>
                <strong className="text-slate-900 text-sm font-semibold">{selectedTask.responsible}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Fechas programadas:</span>
                <strong className="text-slate-900 text-sm font-semibold">{selectedTask.dates}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Estado actual:</span>
                <strong className="text-slate-900 font-semibold">{selectedTask.status}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Fase del proyecto:</span>
                <span className="text-slate-800">{selectedTask.phase}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                Entregable / Evidencia Verificable:
              </span>
              <p className="text-xs sm:text-sm text-slate-800 bg-blue-50/50 p-3 rounded-xl border border-blue-200/60">
                {selectedTask.evidence}
              </p>
            </div>

            {selectedTask.notes && (
              <div className="text-xs text-slate-600 bg-amber-50/60 p-3 rounded-xl border border-amber-200/60">
                <strong>Nota del comité:</strong> {selectedTask.notes}
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
