# 🐾 Vet-Triage · Sistema de Triaje de Urgencia Veterinaria

[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-teal.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Cronograma-Al%20D%C3%ADa%20(50%25)-success.svg)]()
[![Semáforo](https://img.shields.io/badge/Sem%C3%A1foro-Amarillo%20(En%20Riesgo)-yellow.svg)]()

> **Informe Consolidado de Avance al 12 de octubre de 2026 (Día 35 de 87)**  
> Plataforma interactiva e intuitiva para la gestión del proyecto y simulación clínica de triaje veterinario (caninos y felinos) basado en 22 signos clínicos de urgencia y la regla precautoria *"Ante la duda, subir de nivel"*.

---

## 👥 Equipo del Proyecto
| Integrante | Rol | Frentes Clave |
| :--- | :--- | :--- |
| **José Julián Sierra Rodríguez** | Líder de Proyecto & Chatbot | Requisitos, Cronograma Gantt, Flujo del Chatbot (T-20 a T-23), Bitácora semanal (T-36). |
| **Cristóbal Andrés Patiño Castro** | Especialista en Datos & Modelos ML | Recolección, Limpieza, Transformación (T-09 a T-13), Entrenamiento de Modelos (T-14 a T-19). |
| **Sara Sofía Blanco Ardila** | Líder de QA, Criterios & Validación | Fuentes bibliográficas (T-02), Matriz de Riesgos v2 (T-08), Validación de datos (T-11), Batería de Pruebas (T-28 a T-34). |

---

## 📌 Puntos de Entrada & Rutas Principales (Main File Paths)
- **`src/main.tsx`**: **Main file path oficial**. Punto de entrada donde se monta la aplicación React en el DOM (`#root`).
- **`src/App.tsx`**: Componente raíz que orquesta las vistas de resumen ejecutivo, cronograma Gantt, riesgos, simulador y exportador.
- **`index.html`**: Archivo HTML principal con metadatos del proyecto y contenedor de renderizado.
- **`src/utils/triageRules.ts`**: Motor clínico determinístico con los 22 signos de urgencia y reglas de decisión.
- **`src/utils/triageRules.test.ts`**: Pruebas unitarias ejecutadas con `npx tsx --test`.

---

## 📊 Resumen Ejecutivo del Proyecto
- **Período del proyecto:** 8 de septiembre al 3 de diciembre de 2026 (87 días).
- **Fecha de corte del informe:** 12 de octubre de 2026 (Día 35).
- **Tareas vencidas:** 16 de 16 completadas (100% de cumplimiento).
- **Avance ponderado por duración:** **50,0 %** planeado vs **50,0 %** real (Índice de desempeño: **1,00**).
- **Semáforo:** **Amarillo (En riesgo)** por causas estructurales:
  1. Base pequeña y desbalanceada (138 casos: 29 Alto, 94 Moderado, 15 Bajo).
  2. Validación sin veterinario ni clínica piloto (retirados en el cambio de alcance del 29-sep).
  3. Ruta crítica sin holgura (0 días de holgura hasta el 3 de diciembre).
- **Regla precautoria dorada:** *"Ante la duda, subir de nivel"* (aplica a signos dudosos o en conflicto como vómito con sangre/hematemesis).

---

## 🩺 Los 22 Signos de Urgencia Clínica
1. **12 Sólidos (Respaldados por 13 fuentes indexadas):**
   - Dificultad respiratoria severa / Cianosis
   - Paro cardiorrespiratorio o colapso agudo
   - Convulsiones continuas o en racimo (>3 min)
   - Trauma vehicular de alto impacto
   - Hemorragia arterial profusa no controlable
   - Dilatación-Torsión Gástrica (GDV en perros)
   - Obstrucción uretral (especialmente machos felinos)
   - Estupor profundo o coma
   - Hipotermia (<36°C) o Golpe de calor (>41°C)
   - Intoxicación aguda conocida
   - Quemaduras de 2do/3er grado extensas
   - Proptosis ocular o herida penetrante en globo ocular
2. **8 con Umbral por Contrastar:** Taquipnea sin cianosis, Dolor abdominal agudo, Vómitos repetidos (>3 en 12h), Cojera aguda por fractura cerrada, Herida profunda/laceración, Letargia con deshidratación >7%, Diarrea hemorrágica sin shock, Disuria/hematuria no obstructiva.
3. **1 en Conflicto:** Vómito con sangre (Hematemesis) $\rightarrow$ asignado obligatoriamente a **ALTO** por el principio *"ante la duda, subir de nivel"*.
4. **1 sin Fuente:** Diarrea acuosa aislada $\rightarrow$ asignada a **BAJO** y declarada como limitación.

---

## 🚀 Cómo Ejecutar Localmente

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/vet-triage.git
cd vet-triage

# 2. Instalar dependencias
npm install

# 3. Correr las pruebas unitarias
npx tsx --test src/utils/triageRules.test.ts

# 4. Iniciar el servidor interactivo de desarrollo
npm run dev
```

---

## 📤 Subir a un Nuevo Repositorio en GitHub

```bash
# 1. Crear un repo vacío en https://github.com/new (llamado 'vet-triage')
# 2. En tu terminal:
git init
git add .
git commit -m "feat: Vet-Triage v1.0 - Plataforma consolidada de avance y motor clínico"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/vet-triage.git
git push -u origin main
```
