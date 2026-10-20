/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { Header, NavigationTab } from './components/Header';
import { ExecutiveSummaryView } from './components/ExecutiveSummaryView';
import { GanttScheduleView } from './components/GanttScheduleView';
import { RisksAndDataQualityView } from './components/RisksAndDataQualityView';
import { ClinicalSimulatorView } from './components/ClinicalSimulatorView';
import { DatasetExplorerView } from './components/DatasetExplorerView';
import { PrintReportModal } from './components/PrintReportModal';
import { ClinicalCase } from './data/reportData';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('resumen');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const handleLoadCaseInSimulator = (_c: ClinicalCase) => {
    setActiveTab('simulador');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'resumen' && (
          <ExecutiveSummaryView onNavigateToTab={(tab) => setActiveTab(tab)} />
        )}

        {activeTab === 'gantt' && (
          <GanttScheduleView />
        )}

        {activeTab === 'riesgos' && (
          <RisksAndDataQualityView />
        )}

        {activeTab === 'simulador' && (
          <ClinicalSimulatorView />
        )}

        {activeTab === 'dataset' && (
          <DatasetExplorerView onLoadCaseInSimulator={handleLoadCaseInSimulator} />
        )}
      </main>

      {/* Printable Report Modal */}
      <PrintReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-semibold text-slate-300">
              Vet-Triage · Sistema de Triaje de Urgencia Veterinaria
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              José Julián Sierra Rodríguez · Cristóbal Andrés Patiño Castro · Sara Sofía Blanco Ardila
            </p>
          </div>

          <div className="text-[11px] text-slate-500">
            <span>Fecha de corte: 12 de octubre de 2026 (Día 35 de 87)</span>
            <span className="mx-2">·</span>
            <span className="text-amber-400 font-medium">Semáforo Amarillo</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
