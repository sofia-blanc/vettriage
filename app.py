"""
Vet-Triage · Sistema de Triaje de Urgencia Veterinaria
Informe Consolidado de Avance & Simulador Clínico (Streamlit Edition)
Integrantes: José Julián Sierra Rodríguez, Cristóbal Andrés Patiño Castro, Sara Sofía Blanco Ardila
Fecha de corte: 12 de octubre de 2026 (Día 35 de 87)
"""

import streamlit as st
import pandas as pd

# -----------------------------------------------------------------------------
# Configuración inicial de Streamlit
# -----------------------------------------------------------------------------
st.set_page_config(
    page_title="Vet-Triage · Informe y Simulador Clínico",
    page_icon="🐾",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Estilos CSS personalizados para una interfaz cómoda e intuitiva
st.markdown("""
<style>
    .metric-card {
        background-color: #f8fafc;
        border-radius: 12px;
        padding: 16px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .badge-alto {
        background-color: #ffe4e6;
        color: #9f1239;
        padding: 4px 10px;
        border-radius: 9999px;
        font-weight: 700;
        border: 1px solid #fecdd3;
    }
    .badge-moderado {
        background-color: #fef3c7;
        color: #92400e;
        padding: 4px 10px;
        border-radius: 9999px;
        font-weight: 700;
        border: 1px solid #fde68a;
    }
    .badge-bajo {
        background-color: #d1fae5;
        color: #065f46;
        padding: 4px 10px;
        border-radius: 9999px;
        font-weight: 700;
        border: 1px solid #a7f3d0;
    }
</style>
""", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# Catálogo de los 22 Signos de Urgencia Clínica
# -----------------------------------------------------------------------------
URGENCY_SIGNS = [
    # 12 Sólidos (OE1)
    {"id": "s-01", "name": "Dificultad respiratoria severa / Cianosis / Ortopnea", "nivel": "Alto", "categoria": "Sólido (13 fuentes)", "desc": "Respiración con boca abierta, mucosas azules/pálidas, esfuerzo abdominal."},
    {"id": "s-02", "name": "Paro cardiorrespiratorio o colapso agudo sin respuesta", "nivel": "Alto", "categoria": "Sólido", "desc": "Inconsciencia súbita, pulso imperceptible o respiración agónica."},
    {"id": "s-03", "name": "Convulsiones activas continuas o en racimo (>3 min)", "nivel": "Alto", "categoria": "Sólido", "desc": "Estatus epiléptico continuo o múltiples convulsiones sin recuperar consciencia."},
    {"id": "s-04", "name": "Trauma de alto impacto / Atropellamiento vehicular", "nivel": "Alto", "categoria": "Sólido", "desc": "Sospecha de hemorragia interna, neumotórax o fracturas inestables."},
    {"id": "s-05", "name": "Hemorragia arterial o profusa no controlable", "nivel": "Alto", "categoria": "Sólido", "desc": "Sangrado pulsátil o abundante que no cede a la compresión."},
    {"id": "s-06", "name": "Sospecha de Dilatación-Torsión Gástrica (GDV)", "nivel": "Alto", "categoria": "Sólido", "desc": "Abdomen timpanítico distendido, náuseas improductivas, inquietud extrema."},
    {"id": "s-07", "name": "Obstrucción uretral aguda / Anuria dolorosa", "nivel": "Alto", "categoria": "Sólido", "desc": "Imposibilidad de orinar, quejidos en arenero (muy crítico en machos felinos)."},
    {"id": "s-08", "name": "Estupor profundo, coma o falta total de respuesta", "nivel": "Alto", "categoria": "Sólido", "desc": "Pérdida de reflejos y estado de inconsciencia."},
    {"id": "s-09", "name": "Hipotermia extrema (<36°C) o Golpe de calor (>41°C)", "nivel": "Alto", "categoria": "Sólido", "desc": "Fallo termorregulador crítico con riesgo multiorgánico."},
    {"id": "s-10", "name": "Intoxicación aguda conocida (rodenticida, lirios, etc.)", "nivel": "Alto", "categoria": "Sólido", "desc": "Ingesta presunta de tóxicos mortales o neurotoxinas."},
    {"id": "s-11", "name": "Quemaduras de 2do/3er grado extensas (>15% corporal)", "nivel": "Alto", "categoria": "Sólido", "desc": "Lesiones térmicas extensas con riesgo de shock hipovolémico."},
    {"id": "s-12", "name": "Proptosis ocular o perforación corneal aguda", "nivel": "Alto", "categoria": "Sólido", "desc": "Globo ocular luxado fuera de la órbita o herida penetrante."},

    # 8 con Umbral por contrastar
    {"id": "s-13", "name": "Taquipnea moderada sin cianosis", "nivel": "Moderado", "categoria": "Umbral por contrastar", "desc": ">40 respiraciones/min en reposo, encías rosadas."},
    {"id": "s-14", "name": "Dolor abdominal agudo sin distensión masiva", "nivel": "Moderado", "categoria": "Umbral por contrastar", "desc": "Postura de rezo, sensibilidad a la palpación, abdomen blando."},
    {"id": "s-15", "name": "Vómitos repetidos (>3 episodios en 12 horas)", "nivel": "Moderado", "categoria": "Umbral por contrastar", "desc": "Riesgo de deshidratación y desequilibrio electrolítico agudo."},
    {"id": "s-16", "name": "Cojera aguda sin apoyo (sospecha fractura cerrada)", "nivel": "Moderado", "categoria": "Umbral por contrastar", "desc": "Imposibilidad para apoyar la extremidad sin exposición ósea externa."},
    {"id": "s-17", "name": "Herida abierta profunda o laceración cutánea", "nivel": "Moderado", "categoria": "Umbral por contrastar", "desc": "Pérdida de continuidad cutánea amplia sin sangrado arterial activo."},
    {"id": "s-18", "name": "Letargia marcada con deshidratación clínica (>7%)", "nivel": "Moderado", "categoria": "Umbral por contrastar", "desc": "Retardo en pliegue cutáneo >3s, mucosas orales secas."},
    {"id": "s-19", "name": "Diarrea hemorrágica abundante sin shock", "nivel": "Moderado", "categoria": "Umbral por contrastar", "desc": "Evacuación sanguinolenta en animal alerta y activo."},
    {"id": "s-20", "name": "Disuria o hematuria con micción presente", "nivel": "Moderado", "categoria": "Umbral por contrastar", "desc": "Dolor o esfuerzo pero con emisión comprobada de orina."},

    # 1 en Conflicto
    {"id": "s-21", "name": "Vómito con sangre visible (Hematemesis)", "nivel": "Alto", "categoria": "En conflicto (Regla de oro: Subir a ALTO)", "desc": "Asignado a ALTO preventivo por regla de oro 'ante la duda, subir de nivel'."},

    # 1 sin Fuente
    {"id": "s-22", "name": "Diarrea acuosa aislada (sin vómito, alerta)", "nivel": "Bajo", "categoria": "Sin fuente (Declarado como limitación)", "desc": "Episodio digestivo leve autolimitado sin compromiso sistémico."}
]

# -----------------------------------------------------------------------------
# Motor Clínico de Triaje: Reglas y Escalamiento
# -----------------------------------------------------------------------------
def evaluar_triaje(especie, motivo, signos_seleccionados, ante_la_duda):
    signos_obj = [s for s in URGENCY_SIGNS if s["id"] in signos_seleccionados]
    
    tiene_alto = any(s["nivel"] == "Alto" for s in signos_obj)
    tiene_moderado = any(s["nivel"] == "Moderado" for s in signos_obj)
    
    if tiene_alto:
        nivel_base = "Alto"
    elif tiene_moderado:
        nivel_base = "Moderado"
    else:
        nivel_base = "Bajo"
        
    nivel_final = nivel_base
    reglas_aplicadas = []
    escalado = False
    
    # Conflicto clínico hematemesis
    if any(s["id"] == "s-21" for s in signos_obj):
        reglas_aplicadas.append("Regla de conflicto clínico (T-11): Hematemesis elevada a ALTO.")
        
    # Regla: Gato macho con signos urinarios
    if especie == "Felino" and any(s["id"] in ["s-07", "s-20"] for s in signos_obj) and nivel_final != "Alto":
        nivel_final = "Alto"
        escalado = True
        reglas_aplicadas.append("Regla de riesgo felino: Dificultad urinaria en gatos escala a ALTO por riesgo de uretrostomía/bloqueo mortal.")
        
    # Regla del comité: "Ante la duda, subir de nivel"
    if ante_la_duda:
        if nivel_final == "Bajo":
            nivel_final = "Moderado"
            escalado = True
            reglas_aplicadas.append("Regla del comité: 'Ante la duda, subir de nivel' aplicada (Bajo -> Moderado).")
        elif nivel_final == "Moderado":
            nivel_final = "Alto"
            escalado = True
            reglas_aplicadas.append("Regla del comité: 'Ante la duda, subir de nivel' aplicada (Moderado -> Alto).")
            
    # Tiempos y recomendaciones
    if nivel_final == "Alto":
        espera = "Inmediata (< 15 minutos)"
        color = "red"
        recs = [
            "🔴 Mantener vía aérea despejada en posición esternal con cuello estirado.",
            "🔴 Prohibido dar alimentos, leche o medicamentos humanos (paracetamol/ibuprofeno).",
            "🔴 Trasladar en transportín rígido o camilla improvisada manteniendo temperatura.",
            "🔴 Contactar de inmediato a la clínica de urgencias 24h para preparar box de reanimación."
        ]
    elif nivel_final == "Moderado":
        espera = "Prioritaria (< 60 a 120 minutos)"
        color = "orange"
        recs = [
            "🟡 Reposo absoluto en ambiente tranquilo y atemperado.",
            "🟡 Retirar acceso a raciones copiosas de comida; agua en sorbos pequeños si no hay náuseas.",
            "🟡 Monitorear frecuencia respiratoria en reposo (contar respiraciones en 1 minuto).",
            "🟡 Observar coloración de encías (deben ser rosadas, no pálidas ni azuladas)."
        ]
    else:
        espera = "Diferible / Ambulatoria (24 a 48 horas)"
        color = "green"
        recs = [
            "🟢 Monitorear ingesta voluntaria de agua y apetito durante 12-24 horas.",
            "🟢 Dieta blanda de fácil digestión previa indicación veterinaria.",
            "🟢 Consultar de urgencia si aparecen vómitos frecuentes o letargia marcada."
        ]
        
    return {
        "nivel": nivel_final,
        "espera": espera,
        "color": color,
        "reglas": reglas_aplicadas,
        "recomendaciones": recs,
        "escalado": escalado,
        "signos": signos_obj
    }

# -----------------------------------------------------------------------------
# Menú de Navegación Lateral
# -----------------------------------------------------------------------------
with st.sidebar:
    st.image("https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&auto=format&fit=crop&q=80", use_container_width=True)
    st.title("Vet-Triage")
    st.caption("Sistema de Triaje Veterinario & Informe de Avance")
    st.markdown("---")
    
    opcion = st.radio(
        "Módulos del Sistema:",
        [
            "📊 Resumen Ejecutivo & KPIs",
            "🩺 Simulador Clínico de Triaje",
            "📅 Cronograma Gantt (39 Tareas)",
            "⚠️ Matriz de Riesgos & Calidad",
            "📁 Explorador de 138 Casos",
            "🚀 Exportación & GitHub"
        ]
    )
    
    st.markdown("---")
    st.info("**Corte:** 12-oct-2026 (Día 35/87)\n\n**Semáforo:** 🟡 Amarillo (Riesgo Estructural)\n\n**Avance Ponderado:** 50,0 % (Índice 1,00)")

# -----------------------------------------------------------------------------
# 1. RESUMEN EJECUTIVO & KPIS
# -----------------------------------------------------------------------------
if opcion == "📊 Resumen Ejecutivo & KPIs":
    st.subheader("Informe Consolidado de Avance · Vet-Triage")
    st.caption("José Julián Sierra Rodríguez · Cristóbal Andrés Patiño Castro · Sara Sofía Blanco Ardila")
    
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Avance Ponderado", "50,0 %", "Índice 1,00 (Al día)")
    with col2:
        st.metric("Tareas Vencidas", "16 / 16", "100 % cerradas")
    with col3:
        st.metric("Signos Sólidos", "12 / 22", "Cumple OE1")
    with col4:
        st.metric("Holgura Ruta Crítica", "0 días", "Alerta R11")

    st.markdown("---")
    
    col_a, col_b = st.columns(2)
    with col_a:
        st.warning("### 🟡 Semáforo Amarillo: Causas Estructurales\n"
                   "1. **Base pequeña y desbalanceada:** 138 casos (29 Alto, 94 Moderado, 15 Bajo provenientes de D2 sintético).\n"
                   "2. **Validación sin veterinario:** Retiro de clínica piloto el 29-sep. Criterios validados con 13 fuentes y regla 'ante la duda, subir de nivel'.\n"
                   "3. **Ruta crítica sin holgura:** Cristóbal concentra la cadena de datos (T-09 a T-19) hasta el 3 de diciembre.")
    
    with col_b:
        st.info("### 📝 Cambio de Alcance (29-sep)\n"
                "- **Qué cambió:** Retiro de la clínica y veterinario piloto. Tareas renombradas: T-02, T-09, T-11, T-34 y T-35.\n"
                "- **Mecanismo de compensación:** Regla 'ante la duda, subir de nivel' y declaración de limitaciones metodológicas.\n"
                "- **Cronograma y costo:** Sin modificaciones en la fecha final (3-dic) ni gasto adicional.")

    st.markdown("### Resumen de las 5 Fases del Proyecto")
    fases_df = pd.DataFrame([
        {"Fase": "1. Iniciación", "Periodo": "8–17 sep", "Tareas": 3, "Completadas": 3, "En curso": 0, "Próximas": 0, "Estado": "Cerrada"},
        {"Fase": "2. Planeación", "Periodo": "18–26 sep", "Tareas": 5, "Completadas": 5, "En curso": 0, "Próximas": 0, "Estado": "Cerrada"},
        {"Fase": "3. Ejecución", "Periodo": "23 sep–24 nov", "Tareas": 25, "Completadas": 8, "En curso": 1, "Próximas": 16, "Estado": "En curso, al día"},
        {"Fase": "4. Seguimiento y control", "Periodo": "25 nov–3 dic", "Tareas": 3, "Completadas": 0, "En curso": 1, "Próximas": 2, "Estado": "En curso (T-36)"},
        {"Fase": "5. Cierre", "Periodo": "25 nov–2 dic", "Tareas": 3, "Completadas": 0, "En curso": 0, "Próximas": 3, "Estado": "Por iniciar"},
    ])
    st.dataframe(fases_df, hide_index=True, use_container_width=True)

# -----------------------------------------------------------------------------
# 2. SIMULADOR CLÍNICO DE TRIAJE
# -----------------------------------------------------------------------------
elif opcion == "🩺 Simulador Clínico de Triaje":
    st.subheader("Simulador Clínico de Triaje Veterinario")
    st.caption("Implementación de las tareas T-20 a T-23 con la regla precautoria 'Ante la duda, subir de nivel'")
    
    col_input, col_output = st.columns([1, 1])
    
    with col_input:
        st.markdown("#### Datos del Paciente")
        nombre = st.text_input("Nombre de la mascota:", value="Max")
        col_esp, col_edad = st.columns(2)
        with col_esp:
            especie = st.selectbox("Especie:", ["Canino", "Felino"])
        with col_edad:
            edad = st.number_input("Edad (Años):", min_value=0, max_value=25, value=4)
            
        motivo = st.text_area("Motivo de consulta reportado por el tutor:", value="Dificultad respiratoria súbita y lengua azulada")
        
        ante_la_duda = st.checkbox("⚠️ Activar regla: 'Ante la duda, subir de nivel' (ambigüedad o sospecha clínica)")
        
        st.markdown("#### Selección de Signos Clínicos")
        opciones_signos = {s["name"]: s["id"] for s in URGENCY_SIGNS}
        signos_seleccionados_nombres = st.multiselect(
            "Selecciona los signos observados:",
            options=list(opciones_signos.keys()),
            default=["Dificultad respiratoria severa / Cianosis / Ortopnea"]
        )
        signos_ids = [opciones_signos[nom] for nom in signos_seleccionados_nombres]
        
    with col_output:
        st.markdown("#### Dictamen de Triaje Clínico")
        resultado = evaluar_triaje(especie, motivo, signos_ids, ante_la_duda)
        
        if resultado["nivel"] == "Alto":
            st.error(f"## 🚨 PRIORIDAD: Nivel {resultado['nivel'].upper()}\n**Tiempo de atención:** {resultado['espera']}")
        elif resultado["nivel"] == "Moderado":
            st.warning(f"## ⚠️ PRIORIDAD: Nivel {resultado['nivel'].upper()}\n**Tiempo de atención:** {resultado['espera']}")
        else:
            st.success(f"## 🟢 PRIORIDAD: Nivel {resultado['nivel'].upper()}\n**Tiempo de atención:** {resultado['espera']}")
            
        if resultado["escalado"]:
            st.info("🛡️ **Regla precautoria activada:** El nivel se elevó en virtud del principio 'Ante la duda, subir de nivel'.")
            
        if resultado["reglas"]:
            st.markdown("**Reglas clínicas aplicadas:**")
            for r in resultado["reglas"]:
                st.write(f"- {r}")
                
        st.markdown("#### Recomendaciones Inmediatas (T-22)")
        for rec in resultado["recomendaciones"]:
            st.write(rec)

# -----------------------------------------------------------------------------
# 3. CRONOGRAMA GANTT (39 TAREAS)
# -----------------------------------------------------------------------------
elif opcion == "📅 Cronograma Gantt (39 Tareas)":
    st.subheader("Cronograma Oficial de 39 Tareas")
    st.caption("Filtros por fase, responsable y ruta crítica (Alerta R11)")
    
    tareas = [
        {"ID": "T-01", "Tarea": "Definición del problema, objetivos y stakeholders", "Fase": "1. Iniciación", "Responsable": "Julián", "Fechas": "8 sep – 11 sep", "Estado": "Completada", "RutaCrítica": True},
        {"ID": "T-02", "Tarea": "Fuentes veterinarias y criterios de urgencia", "Fase": "1. Iniciación", "Responsable": "Sara", "Fechas": "8 sep – 12 sep", "Estado": "Completada", "RutaCrítica": False},
        {"ID": "T-03", "Tarea": "Levantamiento de requisitos (RF y RNF)", "Fase": "1. Iniciación", "Responsable": "Julián", "Fechas": "13 sep – 17 sep", "Estado": "Completada", "RutaCrítica": True},
        {"ID": "T-04", "Tarea": "Cronograma y estimación de tiempos", "Fase": "2. Planeación", "Responsable": "Julián", "Fechas": "18 sep – 20 sep", "Estado": "Completada", "RutaCrítica": True},
        {"ID": "T-05", "Tarea": "Definición de fuentes y estructura de datos", "Fase": "2. Planeación", "Responsable": "Cristóbal", "Fechas": "18 sep – 22 sep", "Estado": "Completada", "RutaCrítica": False},
        {"ID": "T-08", "Tarea": "Plan de riesgos y contingencia (Matriz v2)", "Fase": "2. Planeación", "Responsable": "Sara", "Fechas": "21 sep – 23 sep", "Estado": "Completada", "RutaCrítica": False},
        {"ID": "T-09", "Tarea": "Recolección de datos (138 casos)", "Fase": "3. Ejecución", "Responsable": "Cristóbal", "Fechas": "27 sep – 1 oct", "Estado": "Completada", "RutaCrítica": True},
        {"ID": "T-10", "Tarea": "Estructuración de datos y estrategia de balance", "Fase": "3. Ejecución", "Responsable": "Cristóbal", "Fechas": "2 oct – 4 oct", "Estado": "Completada", "RutaCrítica": True},
        {"ID": "T-11", "Tarea": "Validación de datos contra literatura", "Fase": "3. Ejecución", "Responsable": "Sara", "Fechas": "5 oct – 7 oct", "Estado": "Completada", "RutaCrítica": False},
        {"ID": "T-12", "Tarea": "Limpieza de datos", "Fase": "3. Ejecución", "Responsable": "Cristóbal", "Fechas": "8 oct – 10 oct", "Estado": "Completada", "RutaCrítica": True},
        {"ID": "T-13", "Tarea": "Transformación de datos", "Fase": "3. Ejecución", "Responsable": "Cristóbal", "Fechas": "11 oct – 13 oct", "Estado": "En curso", "RutaCrítica": True},
        {"ID": "T-14", "Tarea": "Etiquetado por nivel de urgencia", "Fase": "3. Ejecución", "Responsable": "Cristóbal", "Fechas": "14 oct – 17 oct", "Estado": "Próxima", "RutaCrítica": True},
        {"ID": "T-16", "Tarea": "Entrenamiento de modelos (al menos 3)", "Fase": "3. Ejecución", "Responsable": "Cristóbal", "Fechas": "20 oct – 25 oct", "Estado": "Próxima", "RutaCrítica": True},
        {"ID": "T-20", "Tarea": "Diseño del flujo del chatbot", "Fase": "3. Ejecución", "Responsable": "Julián", "Fechas": "23 sep – 26 sep", "Estado": "Completada", "RutaCrítica": False},
        {"ID": "T-21", "Tarea": "Implementación de preguntas", "Fase": "3. Ejecución", "Responsable": "Julián", "Fechas": "27 sep – 1 oct", "Estado": "Completada", "RutaCrítica": False},
        {"ID": "T-22", "Tarea": "Implementación de recomendaciones", "Fase": "3. Ejecución", "Responsable": "Julián", "Fechas": "2 oct – 5 oct", "Estado": "Completada", "RutaCrítica": False},
        {"ID": "T-23", "Tarea": "Implementación de escalamiento", "Fase": "3. Ejecución", "Responsable": "Julián", "Fechas": "6 oct – 9 oct", "Estado": "Completada", "RutaCrítica": False},
        {"ID": "T-24", "Tarea": "Integración del modelo en el flujo", "Fase": "3. Ejecución", "Responsable": "Julián", "Fechas": "4 nov – 7 nov", "Estado": "Próxima", "RutaCrítica": True},
        {"ID": "T-35", "Tarea": "Revisión final de desviaciones", "Fase": "4. Seguimiento y control", "Responsable": "Sara", "Fechas": "29 nov – 3 dic", "Estado": "Próxima", "RutaCrítica": True},
        {"ID": "T-36", "Tarea": "Control de avance, riesgos y métricas", "Fase": "4. Seguimiento y control", "Responsable": "Julián", "Fechas": "Continua", "Estado": "En curso", "RutaCrítica": False},
        {"ID": "T-39", "Tarea": "Cierre formal y lecciones aprendidas", "Fase": "5. Cierre", "Responsable": "Cristóbal", "Fechas": "2 dic – 3 dic", "Estado": "Próxima", "RutaCrítica": True},
    ]
    df_tareas = pd.DataFrame(tareas)
    
    col_filtro1, col_filtro2 = st.columns(2)
    with col_filtro1:
        resp_filtro = st.selectbox("Filtrar por Responsable:", ["Todos", "Julián", "Cristóbal", "Sara"])
    with col_filtro2:
        solo_criticas = st.checkbox("🔥 Ver únicamente Ruta Crítica (Holgura = 0)")
        
    df_mostrar = df_tareas.copy()
    if resp_filtro != "Todos":
        df_mostrar = df_mostrar[df_mostrar["Responsable"] == resp_filtro]
    if solo_criticas:
        df_mostrar = df_mostrar[df_mostrar["RutaCrítica"] == True]
        
    st.dataframe(df_mostrar, hide_index=True, use_container_width=True)

# -----------------------------------------------------------------------------
# 4. MATRIZ DE RIESGOS & CALIDAD
# -----------------------------------------------------------------------------
elif opcion == "⚠️ Matriz de Riesgos & Calidad":
    st.subheader("Matriz de Riesgos v2 (Sin veterinario presencial)")
    st.caption("12 riesgos reformulados aprobados por el comité de control")
    
    riesgos = [
        {"ID": "R-01", "Riesgo": "Base desbalanceada (21% Alto, 68% Moderado, 11% Bajo)", "Categoría": "Datos", "Severidad": "Alto", "Estado": "Mitigado", "Mitigación": "Pesos por clase y validación estratificada (T-10)."},
        {"ID": "R-02", "Riesgo": "Tamaño muestral pequeño (138 casos)", "Categoría": "Datos", "Severidad": "Medio", "Estado": "Vigente", "Mitigación": "Modelos con poda para evitar sobreajuste local."},
        {"ID": "R-03", "Riesgo": "Retiro de clínica y veterinario piloto", "Categoría": "Clínico", "Severidad": "Alto", "Estado": "Mitigado", "Mitigación": "Contraste con 13 fuentes y regla 'ante la duda subir de nivel'."},
        {"ID": "R-05", "Riesgo": "Conflicto en hematemesis (vómito con sangre)", "Categoría": "Clínico", "Severidad": "Medio", "Estado": "Cerrado", "Mitigación": "Asignado a nivel ALTO por acuerdo del comité."},
        {"ID": "R-08", "Riesgo": "Falsos negativos en nivel Alto (Recall < 0.90)", "Categoría": "Clínico", "Severidad": "Alto", "Estado": "Vigente", "Mitigación": "Meta obligatoria de Recall >= 0.90 en T-18."},
        {"ID": "R-11", "Riesgo": "Ruta crítica sin holgura hasta el 3 de diciembre", "Categoría": "Cronograma", "Severidad": "Alto", "Estado": "Vigente", "Mitigación": "Control semanal T-36; activación si atraso > 1 día."},
    ]
    st.dataframe(pd.DataFrame(riesgos), hide_index=True, use_container_width=True)

# -----------------------------------------------------------------------------
# 5. EXPLORADOR DE CASOS
# -----------------------------------------------------------------------------
elif opcion == "📁 Explorador de 138 Casos":
    st.subheader("Dataset Clínico de 138 Casos (D1 Reales + D2 Sintéticos)")
    st.caption("Trazabilidad, balance de clases y auditoría de etiquetas")
    
    casos = [
        {"ID": "CASO-001", "Especie": "Canino", "Edad": "4 años", "Fuente": "D1 Real", "Motivo": "Disnea severa y cianosis lingual", "Nivel": "Alto", "Regla": "Signo crítico DIF_RESP_SEV"},
        {"ID": "CASO-002", "Especie": "Felino", "Edad": "2 años", "Fuente": "D1 Real", "Motivo": "Macho sin orinar 18h en arenero", "Nivel": "Alto", "Regla": "Obstrucción uretral felina"},
        {"ID": "CASO-003", "Especie": "Canino", "Edad": "8 años", "Fuente": "D1 Real", "Motivo": "Abdomen timpanítico y arcadas", "Nivel": "Alto", "Regla": "Sospecha torsión gástrica GDV"},
        {"ID": "CASO-007", "Especie": "Canino", "Edad": "6 años", "Fuente": "D1 Real", "Motivo": "Vómito con sangre (hematemesis)", "Nivel": "Alto", "Regla": "Principio 'ante la duda, subir de nivel'"},
        {"ID": "CASO-030", "Especie": "Canino", "Edad": "5 años", "Fuente": "D1 Real", "Motivo": "Vómitos continuos (4 en 8h)", "Nivel": "Moderado", "Regla": "Umbral >3 vómitos sin shock"},
        {"ID": "CASO-031", "Especie": "Felino", "Edad": "4 años", "Fuente": "D2 Sintético", "Motivo": "Cojera aguda sin apoyo", "Nivel": "Moderado", "Regla": "Sospecha fractura cerrada"},
        {"ID": "CASO-124", "Especie": "Canino", "Edad": "1 año", "Fuente": "D2 Sintético", "Motivo": "Diarrea blanda matutina única", "Nivel": "Bajo", "Regla": "Cuadro digestivo leve aislado"},
    ]
    st.dataframe(pd.DataFrame(casos), hide_index=True, use_container_width=True)

# -----------------------------------------------------------------------------
# 6. EXPORTACIÓN & GITHUB
# -----------------------------------------------------------------------------
elif opcion == "🚀 Exportación & GitHub":
    st.subheader("Subir a GitHub & Rutas de Archivos")
    
    st.markdown("""
    ### 📂 Main File Path para Streamlit
    El archivo principal para ejecutar esta aplicación en Streamlit es:
    - **`app.py`** (o su alias **`main.py`**)
    
    Para ejecutarlo localmente:
    ```bash
    pip install -r requirements.txt
    streamlit run app.py
    ```
    
    ### 🐙 Comandos para subir a tu nuevo repositorio de GitHub
    ```bash
    git init
    git add .
    git commit -m "feat: Vet-Triage v1.0 - Streamlit & React Triage System"
    git branch -M main
    git remote add origin https://github.com/TU_USUARIO/vet-triage.git
    git push -u origin main
    ```
    """)
