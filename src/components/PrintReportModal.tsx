/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { Printer, Download, X } from 'lucide-react';
import { 
  PROJECT_METADATA, 
  PHASES_SUMMARY, 
  CORRECTIVE_ACTIONS, 
  DEVIATIONS_LIST 
} from '../data/reportData';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-300 animate-scaleUp overflow-hidden">
        {/* Modal Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm">Vista de Impresión / Exportación PDF · Vet-Triage</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Guardar como PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Formal Document Content */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-900 text-xs sm:text-sm print:p-0">
          <div className="text-center border-b pb-4 space-y-1">
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              Informe Consolidado de Avance
            </h1>
            <p className="text-sm font-semibold text-slate-600">
              Vet-Triage · Iniciación, Planeación y Ejecución
            </p>
            <div className="text-xs text-slate-500">
              Corte: 12 de octubre de 2026 (Día 35 de 87) · Período: 8 de septiembre al 3 de diciembre de 2026
            </div>
          </div>

          {/* Table of Members */}
          <table className="w-full text-left border-collapse border border-slate-300 text-xs">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 font-bold bg-slate-100 w-1/4">Integrantes:</td>
                <td className="p-2.5">
                  José Julián Sierra Rodríguez (líder y chatbot), Cristóbal Andrés Patiño Castro (datos y modelos), Sara Sofía Blanco Ardila (QA y criterios de urgencia).
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 font-bold bg-slate-100">Plan vigente:</td>
                <td className="p-2.5">Entrega I ajustada (29-sep): 39 tareas, 5 fases, sin clínica ni veterinario piloto.</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold bg-slate-100">Fuentes:</td>
                <td className="p-2.5">Gantt corregido, acta del comité de control del 29-sep e informes de Julián, Sara y Cristóbal.</td>
              </tr>
            </tbody>
          </table>

          {/* Section 1 */}
          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 border-b pb-1">
              1. Resumen Ejecutivo
            </h2>
            <p className="text-justify text-slate-700 leading-relaxed">
              El equipo está al día con el Gantt. El proyecto sigue en riesgo por la calidad de los datos y la validación sin veterinario.
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li><strong>Cronograma:</strong> Las 16 tareas con fecha de fin anterior al corte están completadas y no hay tareas vencidas pendientes (16 de 38 tareas finitas, 42%).</li>
              <li><strong>Avance ponderado:</strong> 50,0 % planeado. Tareas cerradas suman 48,5 % (65 de 134 días-tarea); con T-13 en curso según lo planeado (2 de 3 días) se llega a 50,0 %, índice 1,00.</li>
              <li><strong>Alcance:</strong> Desde el 29 de septiembre no hay clínica ni veterinario. La validación se hace contra 13 fuentes publicadas y las pruebas finales con casos definidos por el equipo.</li>
              <li><strong>Semáforo:</strong> Amarillo (en riesgo) por riesgos estructurales: base pequeña y desbalanceada (138 casos), validación sin veterinario y ruta crítica sin holgura.</li>
            </ul>
          </div>

          {/* Summary of phases table */}
          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 border-b pb-1">
              2. Fases del Proyecto y Estado
            </h2>
            <table className="w-full text-left border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100 font-bold border-b border-slate-300">
                  <th className="p-2">Fase</th>
                  <th className="p-2">Periodo</th>
                  <th className="p-2 text-center">Tareas</th>
                  <th className="p-2 text-center">Completadas</th>
                  <th className="p-2 text-center">En curso</th>
                  <th className="p-2 text-center">Próximas</th>
                  <th className="p-2 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {PHASES_SUMMARY.map(p => (
                  <tr key={p.phase}>
                    <td className="p-2 font-medium">{p.phase}</td>
                    <td className="p-2 text-slate-600">{p.period}</td>
                    <td className="p-2 text-center">{p.totalTasks}</td>
                    <td className="p-2 text-center font-bold text-emerald-800">{p.completed}</td>
                    <td className="p-2 text-center font-bold text-blue-800">{p.inProgress}</td>
                    <td className="p-2 text-center">{p.upcoming}</td>
                    <td className="p-2 text-right font-medium">{p.state}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Acciones Correctivas */}
          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 border-b pb-1">
              3. Acciones Correctivas del Comité (4 al 7 de Octubre)
            </h2>
            <table className="w-full text-left border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100 font-bold border-b border-slate-300">
                  <th className="p-2">Acción</th>
                  <th className="p-2">Responsable</th>
                  <th className="p-2">Fecha</th>
                  <th className="p-2">Estado al 12-oct</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {CORRECTIVE_ACTIONS.map(a => (
                  <tr key={a.id}>
                    <td className="p-2 font-medium">{a.action}</td>
                    <td className="p-2">{a.responsible}</td>
                    <td className="p-2">{a.deadline}</td>
                    <td className="p-2 font-semibold text-emerald-800">{a.status}. {a.evidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div className="pt-8 border-t border-slate-300 grid grid-cols-3 gap-6 text-center text-xs">
            <div>
              <div className="border-t border-slate-400 pt-1 font-bold">José Julián Sierra Rodríguez</div>
              <div className="text-slate-500">Líder y Chatbot</div>
            </div>
            <div>
              <div className="border-t border-slate-400 pt-1 font-bold">Cristóbal Andrés Patiño Castro</div>
              <div className="text-slate-500">Datos y Modelos</div>
            </div>
            <div>
              <div className="border-t border-slate-400 pt-1 font-bold">Sara Sofía Blanco Ardila</div>
              <div className="text-slate-500">QA y Criterios de Urgencia</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
