/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { 
  Github, 
  Copy, 
  Check, 
  Terminal, 
  Download, 
  FolderGit2, 
  FileCode2, 
  ExternalLink,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { PROJECT_METADATA } from '../data/reportData';

export const GitHubExportView: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const gitBashCommands = `# 1. Inicializar el repositorio Git local (si no lo está)
git init

# 2. Agregar todos los archivos del proyecto Vet-Triage
git add .

# 3. Crear el commit inicial con el informe de avance consolidado
git commit -m "feat: Vet-Triage v1.0 - Informe consolidado de avance, cronograma Gantt y simulador de triaje"

# 4. Configurar la rama principal
git branch -M main

# 5. Enlazar con tu nuevo repositorio en GitHub (creado en github.com/new)
git remote add origin https://github.com/TU_USUARIO/vet-triage.git

# 6. Subir el proyecto a GitHub
git push -u origin main`;

  const projectReadme = `# Vet-Triage · Sistema de Triaje de Urgencia Veterinaria

> **Informe Consolidado de Avance al 12 de octubre de 2026 (Día 35 de 87)**  
> Plataforma interactiva para la priorización y clasificación de urgencias médicas en caninos y felinos mediante reglas clínicas e inteligencia artificial.

---

## 👥 Equipo del Proyecto
- **José Julián Sierra Rodríguez:** Líder de Proyecto, Requisitos y Diseño del Flujo del Chatbot (T-20 a T-23, T-36).
- **Cristóbal Andrés Patiño Castro:** Especialista en Datos y Modelos ML (T-09 a T-19).
- **Sara Sofía Blanco Ardila:** Líder de QA, Criterios de Urgencia y Pruebas Clínicas (T-02, T-08, T-11, T-28 a T-34).

---

## 📊 Estado Ejecutivo del Proyecto
- **Avance ponderado planeado y real:** 50,0 % (Índice de desempeño 1,00).
- **Cumplimiento de tareas vencidas:** 16 de 16 tareas completadas (100 %).
- **Semáforo:** **Amarillo (En riesgo estructural)** debido a:
  1. Base pequeña y desbalanceada (138 casos: 29 Alto, 94 Moderado, 15 Bajo).
  2. Validación sin veterinario presencial (retirado en ajuste de alcance del 29-sep).
  3. Ruta crítica sin holgura (termina el 3 de diciembre de 2026).
- **Regla dorada del proyecto:** *"Ante la duda, subir de nivel"*.

---

## 🗂️ Estructura del Proyecto y Rutas Clave
\`\`\`
/
├── index.html                   # Entry point HTML con metadatos de Vet-Triage
├── src/
│   ├── main.tsx                 # Main file path: punto de entrada TypeScript/React
│   ├── App.tsx                  # Componente raíz que orquesta vistas y simulador
│   ├── index.css                # Estilos Tailwind CSS
│   ├── data/
│   │   └── reportData.ts        # 39 tareas Gantt, 12 riesgos, 138 casos clínicos
│   ├── utils/
│   │   ├── triageRules.ts       # Motor clínico de los 22 signos y regla precautoria
│   │   └── triageRules.test.ts  # Pruebas unitarias determinísticas (node:test)
│   └── components/
│       ├── Header.tsx           # Navegación y semáforo de estado
│       ├── ExecutiveSummaryView.tsx  # Resumen ejecutivo, KPIs y comité
│       ├── GanttScheduleView.tsx     # Cronograma interactivo y ruta crítica
│       ├── RisksAndDataQualityView.tsx# Matriz de riesgos y auditoría de datos
│       ├── ClinicalSimulatorView.tsx # Simulador de triaje y chatbot guiado
│       ├── DatasetExplorerView.tsx   # Explorador de los 138 casos de prueba
│       ├── GitHubExportView.tsx      # Centro de exportación y guía Git
│       └── PrintReportModal.tsx      # Generador de informe imprimible / PDF
└── metadata.json                # Configuración oficial del applet
\`\`\`

---

## 🚀 Instalación y Ejecución Local
\`\`\`bash
# Instalar dependencias
npm install

# Correr las pruebas unitarias del motor de triaje
npx tsx --test src/utils/triageRules.test.ts

# Iniciar el servidor de desarrollo
npm run dev
\`\`\`
`;

  const downloadMarkdownReport = () => {
    const element = document.createElement('a');
    const file = new Blob([projectReadme], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = 'README_Vet_Triage.md';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-slate-800 text-white border border-slate-700">
              <Github className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">
              Publicación y Sincronización en GitHub
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
            Sube este proyecto completo a un nuevo repositorio de GitHub con su documentación técnica, pruebas unitarias y motor de triaje listos.
          </p>
        </div>

        <button
          onClick={downloadMarkdownReport}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow cursor-pointer transition-colors shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Descargar README.md Oficial</span>
        </button>
      </div>

      {/* Main File Paths Guide */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <FileCode2 className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">
            Rutas Principales del Proyecto (Main File Paths)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block font-mono text-sm mb-1">
              /src/main.tsx
            </span>
            <p className="text-slate-600">
              <strong>Main file path oficial:</strong> Punto de arranque de la aplicación React 19 + TypeScript, monta el árbol en el DOM.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block font-mono text-sm mb-1">
              /src/App.tsx
            </span>
            <p className="text-slate-600">
              <strong>Componente Principal:</strong> Orquesta las pestañas de Informe de Avance, Gantt, Riesgos y Simulador de Triaje.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block font-mono text-sm mb-1">
              /index.html
            </span>
            <p className="text-slate-600">
              <strong>Contenedor HTML raíz:</strong> Carga fuentes, estilos y el script modular de Vite.
            </p>
          </div>
        </div>
      </div>

      {/* Step by Step GitHub Push Guide */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Comandos para Subir a tu Repositorio de GitHub
            </h3>
          </div>

          <button
            onClick={() => copyToClipboard(gitBashCommands, 'git-commands')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer transition-colors"
          >
            {copiedSection === 'git-commands' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>Copiar Comandos</span>
              </>
            )}
          </button>
        </div>

        <ol className="list-decimal list-inside text-xs sm:text-sm text-slate-700 space-y-1 mb-3">
          <li>Crea un nuevo repositorio vacío en <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">github.com/new</a> llamado <code>vet-triage</code>.</li>
          <li>Abre una terminal en la carpeta raíz del proyecto y ejecuta los siguientes comandos:</li>
        </ol>

        <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-slate-200 overflow-x-auto border border-slate-800 shadow-inner">
          <pre>{gitBashCommands}</pre>
        </div>
      </div>

      {/* Generated README preview */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              README.md Técnico Incluido en el Repositorio
            </h3>
          </div>

          <button
            onClick={() => copyToClipboard(projectReadme, 'readme')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer transition-colors"
          >
            {copiedSection === 'readme' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>Copiar Markdown</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 max-h-80 overflow-y-auto whitespace-pre-wrap">
          {projectReadme}
        </div>
      </div>
    </div>
  );
};
