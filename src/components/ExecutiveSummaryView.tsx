/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Calendar, 
  FileText, 
  ChevronRight,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { 
  PROJECT_METADATA, 
  PHASES_SUMMARY, 
  TEAM_MEMBERS, 
  CORRECTIVE_ACTIONS,
  DEVIATIONS_LIST 
} from '../data/reportData';

interface ExecutiveSummaryViewProps {
  onNavigateToTab: (tab: any) => void;
}

export const ExecutiveSummaryView: React.FC<ExecutiveSummaryViewProps> = ({ onNavigateToTab }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero / Executive Highlight */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white border border-slate-700 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Al día con el Cronograma Oficial
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Semáforo Amarillo (Riesgo Estructural)
            </span>
            <span className="text-xs text-slate-300">
              Día 35 de 87 (40.2% del tiempo transcurrido)
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Vet-Triage: Informe Consolidado de Avance
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            El equipo conformado por <strong className="text-white">José Julián Sierra</strong> (líder y chatbot),{' '}
            <strong className="text-white">Cristóbal Andrés Patiño</strong> (datos y modelos) y{' '}
            <strong className="text-white">Sara Sofía Blanco</strong> (QA y criterios de urgencia) cumple al 100% las 16 tareas vencidas al corte del 12 de octubre de 2026. El avance ponderado se sitúa en <strong className="text-emerald-300">50,0 %</strong> (Índice de desempeño 1,00). El proyecto permanece en alerta amarilla debido a la validación sin veterinario presencial, el desbalance del dataset (138 casos) y la ruta crítica sin holgura.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateToTab('simulador')}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Probar Simulador Clínico de Triaje</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateToTab('gantt')}
              className="px-4 py-2.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-white font-medium text-sm flex items-center gap-2 border border-slate-600 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Ver Gantt de 39 Tareas</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Avance Ponderado</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">50,0 %</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              Índice 1,00
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Planeado: 50,0 % · 65 de 134 días-tarea cerrados + 2 días de T-13
          </p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '50%' }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Tareas Vencidas</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">16 / 16</span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
              100 % cerradas
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Cero tareas vencidas pendientes (16 de 38 finitas, 42%)
          </p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Signos Sólidos</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">12 / 22</span>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
              Cumple OE1
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            12 signos con respaldo; 10 son limitaciones declaradas
          </p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '54.5%' }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Holgura Ruta Crítica</span>
            <Clock className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-rose-600">0 días</span>
            <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
              Alerta R11
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            T-35 finaliza el 3-dic; cualquier atraso &gt; 1 día activa comité
          </p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
            <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>

      {/* Semáforo Amarillo & Cambio de Alcance del 29-sep */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Semáforo Card */}
        <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-700">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Semáforo Amarillo: Causas Estructurales
              </h3>
              <p className="text-xs text-slate-600">
                Riesgos que persisten a pesar de que el cronograma está 100% al día
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-slate-700">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-amber-100">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
              <div>
                <strong className="text-slate-900">Base pequeña y desbalanceada:</strong>
                <p className="text-xs text-slate-600 mt-0.5">
                  138 casos totales con solo 29 casos de nivel Alto (21%) y 15 de nivel Bajo (todos del dataset sintético D2). Esto debilita la fiabilidad de la meta de Recall ≥ 0,90 en la prueba de T-18.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-amber-100">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
              <div>
                <strong className="text-slate-900">Validación sin veterinario presencial:</strong>
                <p className="text-xs text-slate-600 mt-0.5">
                  Retiro de la clínica piloto el 29-sep. Las etiquetas se compensan contrastando contra 13 fuentes de literatura y aplicando la regla dorada <em>"ante la duda, subir de nivel"</em>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-amber-100">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
              <div>
                <strong className="text-slate-900">Ruta crítica sin holgura hasta el 3-dic:</strong>
                <p className="text-xs text-slate-600 mt-0.5">
                  Cristóbal concentra la cadena de datos y modelos (T-09 a T-19). Cualquier retraso impacta directamente la fecha de entrega final.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cambio de Alcance Card */}
        <div className="bg-blue-50/40 rounded-2xl p-6 border border-blue-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-700">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Cambio de Alcance (Comité del 29-sep)
              </h3>
              <p className="text-xs text-slate-600">
                Aprobado formalmente sin modificaciones de fecha final ni sobrecosto
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-slate-700">
            <div className="p-3 rounded-xl bg-white border border-blue-100">
              <span className="font-semibold text-slate-900">Qué cambió:</span>
              <p className="text-xs text-slate-600 mt-1">
                Se retiró al veterinario y a la clínica piloto. Se renombraron las tareas T-02, T-09, T-11, T-34 y T-35 conservando su ID.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-blue-100">
              <span className="font-semibold text-slate-900">Mecanismo de compensación:</span>
              <p className="text-xs text-slate-600 mt-1">
                Regla clínica precautoria <strong>"ante la duda, subir de nivel"</strong>, casos ambiguos marcados en base v2 y declaración explícita de la limitación metodológica en la memoria final.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-blue-100">
              <span className="font-semibold text-slate-900">Control de cambios pendiente:</span>
              <p className="text-xs text-slate-600 mt-1">
                Las 9 variables sugeridas por Sara, la capa de reglas y notas PetEVAL deben pasar por comité antes de ingresar al Gantt oficial.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen por Fases */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Estado de las 5 Fases del Proyecto
            </h3>
            <p className="text-xs text-slate-500">
              Total 39 tareas programadas (16 completadas, 2 en curso, 21 próximas)
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('gantt')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Ver desglose completo</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">Fase</th>
                <th className="py-2.5 px-3">Periodo</th>
                <th className="py-2.5 px-3 text-center">Tareas</th>
                <th className="py-2.5 px-3 text-center">Completadas</th>
                <th className="py-2.5 px-3 text-center">En curso</th>
                <th className="py-2.5 px-3 text-center">Próximas</th>
                <th className="py-2.5 px-3 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {PHASES_SUMMARY.map(p => (
                <tr key={p.phase} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">{p.phase}</td>
                  <td className="py-3 px-3 text-slate-500">{p.period}</td>
                  <td className="py-3 px-3 text-center font-bold text-slate-800">{p.totalTasks}</td>
                  <td className="py-3 px-3 text-center text-emerald-700 font-semibold">{p.completed}</td>
                  <td className="py-3 px-3 text-center text-blue-700 font-semibold">{p.inProgress}</td>
                  <td className="py-3 px-3 text-center text-slate-500">{p.upcoming}</td>
                  <td className="py-3 px-3 text-right">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border ${p.stateBadge}`}>
                      {p.state}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integrantes del Equipo y Carga de Trabajo */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">
            Frentes de Trabajo y Recursos (Lectura por Integrante)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TEAM_MEMBERS.map(member => (
            <div key={member.name} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${member.avatarColor} text-white font-bold text-sm flex items-center justify-center shadow`}>
                    {member.name.split(' ')[0][0]}{member.name.split(' ')[1] ? member.name.split(' ')[1][0] : ''}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{member.name}</h4>
                    <span className="text-xs text-indigo-600 font-medium">{member.role}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {member.responsibilities}
                </p>

                <div className="bg-white p-3 rounded-lg border border-slate-200/80 mb-3 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Tareas cerradas:</span>
                    <strong className="text-emerald-700 font-bold">{member.tasksCompleted}</strong>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>En curso:</span>
                    <strong className="text-blue-700 font-bold">{member.tasksInProgress}</strong>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Pendientes futuras:</span>
                    <strong className="text-slate-800 font-bold">{member.tasksPending}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-200 text-xs">
                <span className="font-semibold text-slate-700">Situación actual:</span>
                <p className="text-slate-500 mt-0.5">{member.currentFocus}</p>
                <div className="mt-2 p-2 rounded bg-amber-50 text-amber-800 text-[11px] border border-amber-200">
                  {member.availabilityNote}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Acciones Correctivas del Comité (Las 7 cerradas) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Acciones Correctivas del Comité (4–7 de Octubre)
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            7 de 7 Cerradas (100 %)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
          {CORRECTIVE_ACTIONS.map(ca => (
            <div key={ca.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                ✓
              </span>
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <strong className="text-slate-900 font-medium">{ca.action}</strong>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                    {ca.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>Resp: <strong className="text-slate-700">{ca.responsible}</strong></span>
                  <span>Fecha: <strong className="text-slate-700">{ca.deadline}</strong></span>
                </div>
                <p className="text-xs text-slate-600 pt-0.5">
                  Evidencia: {ca.evidence}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
