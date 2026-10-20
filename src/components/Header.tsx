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
  Printer 
} from 'lucide-react';
import { PROJECT_METADATA } from '../data/reportData';

export type NavigationTab = 
  | 'resumen' 
  | 'gantt' 
  | 'riesgos' 
  | 'simulador' 
  | 'dataset';

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
    <header className="sticky top-0 z-40 bg-[#657166] border-b border-[#545E55] text-white shadow-md">
      {/* Top Banner / Meta Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2.5 text-xs border-b border-[#545E55]/70">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#DAEBE3] text-[#2F614E] border border-[#BDD9CE]">
            Fase 3: Ejecución · Al Día
          </span>
          <span className="text-[#DAEBE3]">
            Corte: <strong className="text-white">{PROJECT_METADATA.cutoffDate}</strong> (Día {PROJECT_METADATA.currentDay} de {PROJECT_METADATA.totalDays})
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Semaphore Status Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FDE8D3] border border-[#F3CFAB] text-[#8C5216] font-bold text-xs">
            <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse"></span>
            Semáforo: Amarillo (Riesgo Estructural)
          </div>

          <button
            onClick={onOpenPrintModal}
            aria-label="Abrir versión imprimible o PDF del informe"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#535F54] hover:bg-[#455046] text-[#DAEBE3] hover:text-white transition-colors cursor-pointer border border-[#6F7C70]"
          >
            <Printer className="w-3.5 h-3.5 text-[#99CDD8]" />
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </div>

      {/* Main Header & Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
        {/* Brand & Project Identity */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#99CDD8] to-[#DAEBE3] flex items-center justify-center shadow-sm shrink-0">
            <Stethoscope className="w-5 h-5 text-[#244147]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white">
                Vet-Triage
              </span>
              <span className="text-[11px] font-semibold text-[#244147] px-2 py-0.5 rounded-md bg-[#99CDD8]">
                Informe & Motor Clínico
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 xl:pb-0 scrollbar-none" aria-label="Navegación principal">
          <button
            onClick={() => setActiveTab('resumen')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'resumen'
                ? 'bg-[#99CDD8] text-[#1D3D44] shadow-sm'
                : 'text-[#DAEBE3] hover:text-white hover:bg-[#535F54]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Informe & KPIs</span>
          </button>

          <button
            onClick={() => setActiveTab('simulador')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'simulador'
                ? 'bg-[#DAEBE3] text-[#1E4D3E] shadow-sm'
                : 'text-[#DAEBE3] hover:text-white hover:bg-[#535F54]'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Estación del Veterinario</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#99CDD8]"></span>
          </button>

          <button
            onClick={() => setActiveTab('gantt')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'gantt'
                ? 'bg-[#99CDD8] text-[#1D3D44] shadow-sm'
                : 'text-[#DAEBE3] hover:text-white hover:bg-[#535F54]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Cronograma (39)</span>
          </button>

          <button
            onClick={() => setActiveTab('riesgos')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'riesgos'
                ? 'bg-[#99CDD8] text-[#1D3D44] shadow-sm'
                : 'text-[#DAEBE3] hover:text-white hover:bg-[#535F54]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Riesgos & Datos</span>
          </button>

          <button
            onClick={() => setActiveTab('dataset')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'dataset'
                ? 'bg-[#99CDD8] text-[#1D3D44] shadow-sm'
                : 'text-[#DAEBE3] hover:text-white hover:bg-[#535F54]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Casos (138)</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
