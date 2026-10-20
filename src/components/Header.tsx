/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { 
  Activity, 
  Calendar, 
  AlertTriangle, 
  Stethoscope, 
  Database, 
  Github, 
  Printer, 
  CheckCircle2, 
  Clock, 
  ShieldAlert
} from 'lucide-react';
import { PROJECT_METADATA } from '../data/reportData';

export type NavigationTab = 
  | 'resumen' 
  | 'gantt' 
  | 'riesgos' 
  | 'simulador' 
  | 'dataset' 
  | 'github';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onOpenPrintModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenPrintModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg backdrop-blur-md bg-opacity-95">
      {/* Top Banner / Meta Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Fase 3: Ejecución · Al Día
          </span>
          <span className="text-slate-400">
            Corte: <strong className="text-slate-200">{PROJECT_METADATA.cutoffDate}</strong> (Día {PROJECT_METADATA.currentDay} de {PROJECT_METADATA.totalDays})
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Semaphore Status Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-medium text-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Semáforo: Amarillo (Riesgo Estructural)
          </div>

          <button
            onClick={onOpenPrintModal}
            aria-label="Abrir versión imprimible o PDF del informe"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-blue-400" />
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </div>

      {/* Main Header & Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
        {/* Brand & Project Identity */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white">
                Vet-Triage
              </span>
              <span className="text-[11px] font-medium text-slate-400 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                Informe & Motor Clínico
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 xl:pb-0 scrollbar-none" aria-label="Navegación principal">
          <button
            onClick={() => setActiveTab('resumen')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'resumen'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Informe & KPIs</span>
          </button>

          <button
            onClick={() => setActiveTab('gantt')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'gantt'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Cronograma (39)</span>
          </button>

          <button
            onClick={() => setActiveTab('riesgos')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'riesgos'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Riesgos & Datos</span>
          </button>

          <button
            onClick={() => setActiveTab('simulador')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'simulador'
                ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                : 'text-teal-300 hover:text-white hover:bg-teal-950/40 border border-teal-500/30'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-teal-300" />
            <span>Simulador de Triaje</span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
          </button>

          <button
            onClick={() => setActiveTab('dataset')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'dataset'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Casos (138)</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'github'
                ? 'bg-slate-700 text-white border border-slate-500'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub & Repositorio</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
