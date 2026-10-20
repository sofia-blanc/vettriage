"""
Vet-Triage · Sistema de Triaje de Urgencia Veterinaria
Informe Consolidado de Avance & Estación Clínica del Médico Veterinario

Paleta oficial del proyecto:
  - #657166 (Verde pizarra / fondo principal de cabeceras)
  - #99CDD8 (Azul celeste veterinario / botones, acentos y tabs)
  - #DAEBE3 (Menta suave / fondos claros, badges y tags)
  - #FDE8D3 (Melocotón / Semáforo Amarillo)
  - #F3C3B2 (Salmón coral / Nivel Alto)
  - #CFD6C4 (Gris salvia / bordes y líneas divisorias)
  - #FAFBF9 (Fondo limpio de la aplicación)
  - #3D4A3E (Texto oscuro principal)
"""

import streamlit as st
import pandas as pd

# -----------------------------------------------------------------------------
# Configuración inicial de Streamlit
# -----------------------------------------------------------------------------
st.set_page_config(
    page_title="Vet-Triage · Estación Clínica Veterinaria",
    page_icon="⚕",
    layout="wide",
    initial_sidebar_state="expanded"
)

# -----------------------------------------------------------------------------
# Inyección de estilos CSS para coincidir exactamente con el Preview
# -----------------------------------------------------------------------------
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        color: #3D4A3E;
    }
    .stApp {
        background-color: #FAFBF9;
    }
    [data-testid="stSidebar"] {
        background: linear-gradient(180deg, #F0F4F1 0%, #E6EDE8 100%);
        border-right: 1px solid #CFD6C4;
    }
    
    /* Hero Header */
    .hero-card {
        background: linear-gradient(135deg, #657166 0%, #4D594E 100%);
        color: #FFFFFF;
        padding: 26px 30px;
        border-radius: 20px;
        box-shadow: 0 8px 24px rgba(101, 113, 102, 0.16);
        margin-bottom: 24px;
        border: 1px solid #7A877B;
        position: relative;
    }
    .hero-badge-green {
        background-color: rgba(218, 235, 227, 0.25);
        color: #DAEBE3;
        border: 1px solid rgba(218, 235, 227, 0.45);
        padding: 4px 12px;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 700;
        display: inline-block;
        margin-right: 8px;
    }
    .hero-badge-yellow {
        background-color: rgba(253, 232, 211, 0.25);
        color: #FDE8D3;
        border: 1px solid rgba(253, 232, 211, 0.45);
        padding: 4px 12px;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 700;
        display: inline-block;
    }
    .hero-title {
        color: #FFFFFF !important;
        font-size: 26px;
        font-weight: 800;
        margin: 14px 0 8px 0;
        letter-spacing: -0.5px;
    }
    .hero-text {
        color: #DAEBE3;
        font-size: 13.5px;
        line-height: 1.6;
        max-width: 950px;
    }
    
    /* KPI Box */
    .metric-box {
        background-color: #FFFFFF;
        border: 1px solid #CFD6C4;
        border-radius: 16px;
        padding: 18px 20px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.03);
        margin-bottom: 12px;
    }
    .metric-label {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        color: #657166;
        margin-bottom: 6px;
    }
    .metric-value {
        font-size: 28px;
        font-weight: 800;
        color: #3D4A3E;
        display: flex;
        align-items: baseline;
        gap: 8px;
    }
    .metric-tag {
        font-size: 11px;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 6px;
    }
    .metric-desc {
        font-size: 11px;
        color: #7A877B;
        margin-top: 6px;
    }
    
    /* Structured Cards */
    .card-peach {
        background-color: #FFF9F3;
        border: 1px solid #FDE8D3;
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 16px;
    }
    .card-mint {
        background-color: #F4FAF7;
        border: 1px solid #DAEBE3;
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 16px;
    }
    .card-blue {
        background-color: #F2F8FA;
        border: 1px solid #99CDD8;
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 16px;
    }
    .card-slate {
        background-color: #657166;
        color: #FFFFFF;
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 16px;
    }
    
    /* Medical Triage Badges */
    .badge-alto {
        background-color: #F3C3B2;
        color: #7D2A18;
        padding: 5px 14px;
        border-radius: 9999px;
        font-weight: 800;
        font-size: 12px;
        border: 1px solid #E8A894;
        display: inline-block;
    }
    .badge-moderado {
        background-color: #FDE8D3;
        color: #8C5216;
        padding: 5px 14px;
        border-radius: 9999px;
        font-weight: 800;
        font-size: 12px;
        border: 1px solid #F3CFAB;
        display: inline-block;
    }
    .badge-bajo {
        background-color: #DAEBE3;
        color: #2F614E;
        padding: 5px 14px;
        border-radius: 9999px;
        font-weight: 800;
        font-size: 12px;
        border: 1px solid #BDD9CE;
        display: inline-block;
    }
    
    /* Buttons */
    .stButton>button {
        background-color: #99CDD8 !important;
        color: #1D3D44 !important;
        font-weight: 700 !important;
        border-radius: 12px !important;
        border: none !important;
        padding: 10px 22px !important;
        box-shadow: 0 3px 8px rgba(153, 205, 216, 0.25) !important;
        transition: all 0.2s ease !important;
    }
    .stButton>button:hover {
        background-color: #85BCC7 !important;
        color: #0E2B31 !important;
    }
</style>
""", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# Catálogo oficial de 22 signos clínicos de urgencia
# -----------------------------------------------------------------------------
URGENCY_SIGNS = [
    {"id": "s-01", "name": "Dificultad respiratoria severa / Cianosis", "sistema": "Respiratorio", "nivel": "Alto"},
    {"id": "s-02", "name": "Paro cardiorrespiratorio o colapso agudo", "sistema": "Cardiovascular", "nivel": "Alto"},
    {"id": "s-03", "name": "Convulsiones continuas o en racimo (>3 min)", "sistema": "Neurológico", "nivel": "Alto"},
    {"id": "s-04", "name": "Trauma vehicular de alto impacto", "sistema": "Trauma", "nivel": "Alto"},
    {"id": "s-05", "name": "Hemorragia arterial o profusa no controlable", "sistema": "Cardiovascular", "nivel": "Alto"},
    {"id": "s-06", "name": "Sospecha dilatación-torsión gástrica (GDV)", "sistema": "Abdominal", "nivel": "Alto"},
    {"id": "s-07", "name": "Obstrucción uretral / Anuria dolorosa", "sistema": "Urológico", "nivel": "Alto"},
    {"id": "s-08", "name": "Estupor profundo, coma o falta de respuesta", "sistema": "Neurológico", "nivel": "Alto"},
    {"id": "s-09", "name": "Hipotermia (<36°C) o Golpe de calor (>41°C)", "sistema": "Sistémico", "nivel": "Alto"},
    {"id": "s-10", "name": "Intoxicación aguda conocida (rodenticida, lirio, chocolate)", "sistema": "Toxicología", "nivel": "Alto"},
    {"id": "s-11", "name": "Quemaduras de 2do/3er grado extensas", "sistema": "Dermatológico/Trauma", "nivel": "Alto"},
    {"id": "s-12", "name": "Proptosis ocular o herida corneal penetrante", "sistema": "Oftalmológico", "nivel": "Alto"},
    {"id": "s-13", "name": "Taquipnea sin cianosis (>40 rpm en reposo)", "sistema": "Respiratorio", "nivel": "Moderado"},
    {"id": "s-14", "name": "Dolor abdominal agudo moderado", "sistema": "Abdominal", "nivel": "Moderado"},
    {"id": "s-15", "name": "Vómitos repetidos (>3 en 12 horas)", "sistema": "Digestivo", "nivel": "Moderado"},
    {"id": "s-16", "name": "Cojera aguda sin apoyo (sospecha fractura)", "sistema": "Locomotor", "nivel": "Moderado"},
    {"id": "s-17", "name": "Herida abierta profunda o laceración", "sistema": "Trauma", "nivel": "Moderado"},
    {"id": "s-18", "name": "Letargia con deshidratación >7%", "sistema": "Sistémico", "nivel": "Moderado"},
    {"id": "s-19", "name": "Diarrea hemorrágica abundante sin shock", "sistema": "Digestivo", "nivel": "Moderado"},
    {"id": "s-20", "name": "Disuria o hematuria con micción presente", "sistema": "Urológico", "nivel": "Moderado"},
    {"id": "s-21", "name": "Vómito con sangre (Hematemesis)", "sistema": "Digestivo", "nivel": "Alto"},
    {"id": "s-22", "name": "Diarrea acuosa aislada", "sistema": "Digestivo", "nivel": "Bajo"}
]

# Pacientes en la cola de urgencias de la clínica
INITIAL_QUEUE = [
    {
        "ID": "ADM-101",
        "Paciente": "Thor",
        "Especie": "Canino (Gran Danés)",
        "Edad": "7 años",
        "Peso": "54.0 kg",
        "Motivo": "Abdomen timpanítico distendido, náuseas improductivas tras ingesta",
        "Constantes": "FC: 165 lpm | FR: 48 rpm | T: 38.6°C | Mucosas: Pálidas | TLLC: 3.0s",
        "Signos": "Sospecha dilatación-torsión gástrica (GDV)",
        "Prioridad": "Alto",
        "Box": "Box 1 Reanimación / Shock",
        "Espera": "6 min"
    },
    {
        "ID": "ADM-102",
        "Paciente": "Milo",
        "Especie": "Felino (Común Europeo)",
        "Edad": "3 años",
        "Peso": "4.8 kg",
        "Motivo": "Macho en esfuerzo doloroso en arenero sin emitir orina hace 16h",
        "Constantes": "FC: 210 lpm | FR: 42 rpm | T: 37.8°C | Mucosas: Rosadas | TLLC: 1.5s",
        "Signos": "Obstrucción uretral / Anuria dolorosa",
        "Prioridad": "Alto",
        "Box": "Box 2 Procedimientos / Sondaje",
        "Espera": "12 min"
    },
    {
        "ID": "ADM-103",
        "Paciente": "Rocky",
        "Especie": "Canino (Bulldog Francés)",
        "Edad": "5 años",
        "Peso": "12.5 kg",
        "Motivo": "Vómito con contenido hemático evidente (hematemesis). Cuadro limítrofe",
        "Constantes": "FC: 130 lpm | FR: 32 rpm | T: 38.8°C | Mucosas: Rosadas | TLLC: 1.5s",
        "Signos": "Vómito con sangre (Hematemesis)",
        "Prioridad": "Alto",
        "Box": "Box 3 Urgencias Generales",
        "Espera": "25 min"
    },
    {
        "ID": "ADM-104",
        "Paciente": "Luna",
        "Especie": "Canino (Golden Retriever)",
        "Edad": "2 años",
        "Peso": "28.0 kg",
        "Motivo": "Vómitos continuos (4 episodios en 8 horas), alerta y normohidratada",
        "Constantes": "FC: 110 lpm | FR: 24 rpm | T: 38.5°C | Mucosas: Rosadas | TLLC: 1.0s",
        "Signos": "Vómitos repetidos (>3 en 12 horas)",
        "Prioridad": "Moderado",
        "Box": "Sala de Observación",
        "Espera": "38 min"
    },
    {
        "ID": "ADM-105",
        "Paciente": "Toby",
        "Especie": "Canino (Poodle)",
        "Edad": "3 años",
        "Peso": "6.2 kg",
        "Motivo": "Diarrea blanda matutina única tras cambio brusco de alimento",
        "Constantes": "FC: 98 lpm | FR: 20 rpm | T: 38.3°C | Mucosas: Rosadas | TLLC: 1.0s",
        "Signos": "Diarrea acuosa aislada",
        "Prioridad": "Bajo",
        "Box": "Consulta Ambulatoria",
        "Espera": "50 min"
    }
]

# -----------------------------------------------------------------------------
# Barra lateral limpia y sobria
# -----------------------------------------------------------------------------
with st.sidebar:
    st.markdown("""
        <div style="margin-bottom: 12px;">
            <h2 style="margin: 0; font-size: 20px; font-weight: 800; color: #3D4A3E; letter-spacing: -0.3px;">Vet-Triage</h2>
            <span style="font-size: 11px; color: #657166; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px;">Estación Clínica del Médico Veterinario</span>
        </div>
    """, unsafe_allow_html=True)
    st.caption("José Julián Sierra Rodríguez · Cristóbal Andrés Patiño Castro · Sara Sofía Blanco Ardila")
    st.markdown("<hr style='border: none; border-top: 1px solid #CFD6C4; margin: 12px 0;'>", unsafe_allow_html=True)
    
    opcion = st.radio(
        "Navegación del Sistema:",
        [
            "Informe & KPIs",
            "Estación del Veterinario",
            "Cronograma (39 Tareas)",
            "Riesgos & Calidad de Datos",
            "Explorador de Casos (138)"
        ]
    )
    
    st.markdown("<hr style='border: none; border-top: 1px solid #CFD6C4; margin: 16px 0;'>", unsafe_allow_html=True)
    st.markdown("""
        <div class="card-peach" style="padding: 12px; margin: 0;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <strong style="color: #8C5216; font-size: 12px;">Semáforo: Amarillo</strong>
                <span style="font-size: 10px; background-color: #F3CFAB; color: #8C5216; padding: 2px 6px; border-radius: 4px; font-weight: 700;">Riesgo Estructural</span>
            </div>
            <span style="font-size: 11.5px; color: #657166; line-height: 1.4; display: block;">
                Corte: <strong>12-oct-2026</strong> (Día 35 de 87)<br>
                Avance Ponderado: <strong>50,0 %</strong> (Índice 1,00)
            </span>
        </div>
    """, unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# 1. INFORME & KPIS (Sin holgura, sin fuentes de trabajo, sin emojis)
# -----------------------------------------------------------------------------
if opcion == "Informe & KPIs":
    st.markdown("""
    <div class="hero-card">
        <div>
            <span class="hero-badge-green">Al día con el Cronograma Oficial</span>
            <span class="hero-badge-yellow">Semáforo Amarillo (Riesgo Estructural)</span>
            <span style="font-size: 12px; color: #DAEBE3; margin-left: 8px;">Día 35 de 87 (40,2% del tiempo transcurrido)</span>
        </div>
        <div class="hero-title">Vet-Triage: Informe Consolidado de Avance</div>
        <div class="hero-text">
            El equipo conformado por <strong>José Julián Sierra</strong> (líder y chatbot), <strong>Cristóbal Andrés Patiño</strong> (datos y modelos) y <strong>Sara Sofía Blanco</strong> (QA y criterios de urgencia) cumple al 100% las 16 tareas vencidas al corte del 12 de octubre de 2026. El avance ponderado se sitúa en <strong>50,0 %</strong> (Índice 1,00). El proyecto permanece en alerta amarilla debido a la validación sin veterinario presencial, el desbalance del dataset (138 casos) y la ruta crítica concentrada.
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # 3 Métricas exactas (Sin holgura)
    c1, c2, c3 = st.columns(3)
    with c1:
        st.markdown("""
        <div class="metric-box">
            <div class="metric-label">Avance Ponderado</div>
            <div class="metric-value">50,0 % <span class="metric-tag" style="background-color: #DAEBE3; color: #2F614E;">Índice 1,00</span></div>
            <div class="metric-desc">Planeado: 50,0 % · 65 de 134 días-tarea cerrados + 2 días de T-13</div>
        </div>
        """, unsafe_allow_html=True)
    with c2:
        st.markdown("""
        <div class="metric-box">
            <div class="metric-label">Tareas Vencidas</div>
            <div class="metric-value">16 / 16 <span class="metric-tag" style="background-color: #99CDD8; color: #1D3D44;">100 % cerradas</span></div>
            <div class="metric-desc">Cero tareas vencidas atrasadas (16 de 38 tareas finitas, 42%)</div>
        </div>
        """, unsafe_allow_html=True)
    with c3:
        st.markdown("""
        <div class="metric-box">
            <div class="metric-label">Signos Sólidos Validados</div>
            <div class="metric-value">12 / 22 <span class="metric-tag" style="background-color: #DAEBE3; color: #2F614E;">Cumple OE1</span></div>
            <div class="metric-desc">12 signos con respaldo de fuentes; 10 son limitaciones declaradas</div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)
    
    col_a, col_b = st.columns(2)
    with col_a:
        st.markdown("""
        <div class="card-peach">
            <h4 style="margin: 0 0 10px 0; color: #8C5216; font-size: 16px; font-weight: 800;">Semáforo Amarillo: Causas Estructurales</h4>
            <div style="font-size: 13px; color: #4D594E; line-height: 1.6;">
                <strong>1. Base pequeña y desbalanceada:</strong> 138 casos (29 Alto, 94 Moderado, 15 Bajo provenientes de D2 sintético). Condiciona la fiabilidad del Recall ≥ 0,90 en la prueba de T-18.<br><br>
                <strong>2. Validación sin veterinario presencial:</strong> Retiro de clínica piloto el 29-sep. Se compensa contrastando con 13 fuentes y aplicando la regla precautoria 'ante la duda, subir de nivel'.<br><br>
                <strong>3. Ruta crítica sin holgura:</strong> Cristóbal concentra la cadena de datos y modelos (T-09 a T-19) hasta el 3 de diciembre. Cualquier desviación afecta la fecha fin.
            </div>
        </div>
        """, unsafe_allow_html=True)
        
    with col_b:
        st.markdown("""
        <div class="card-mint">
            <h4 style="margin: 0 0 10px 0; color: #2F614E; font-size: 16px; font-weight: 800;">Cambio de Alcance (Comité del 29-sep)</h4>
            <div style="font-size: 13px; color: #3D4A3E; line-height: 1.6;">
                <strong>• Qué cambió:</strong> Retiro de la clínica y veterinario piloto. Tareas renombradas formalmente: T-02, T-09, T-11, T-34 y T-35 manteniendo su identificador ID.<br><br>
                <strong>• Mecanismo de compensación:</strong> Regla 'ante la duda, subir de nivel', casos ambiguos marcados en base v2 y declaración explícita de limitaciones metodológicas.<br><br>
                <strong>• Cronograma y costos:</strong> Sin cambios en la fecha de finalización (3 de diciembre) ni presupuesto previsto.
            </div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("### Estado de las 5 Fases del Proyecto")
    fases_df = pd.DataFrame([
        {"Fase": "1. Iniciación", "Periodo": "8–17 sep", "Tareas": 3, "Completadas": 3, "En curso": 0, "Próximas": 0, "Estado": "Cerrada"},
        {"Fase": "2. Planeación", "Periodo": "18–26 sep", "Tareas": 5, "Completadas": 5, "En curso": 0, "Próximas": 0, "Estado": "Cerrada"},
        {"Fase": "3. Ejecución", "Periodo": "23 sep–24 nov", "Tareas": 25, "Completadas": 8, "En curso": 1, "Próximas": 16, "Estado": "En curso, al día"},
        {"Fase": "4. Seguimiento y control", "Periodo": "25 nov–3 dic", "Tareas": 3, "Completadas": 0, "En curso": 1, "Próximas": 2, "Estado": "En curso (T-36)"},
        {"Fase": "5. Cierre", "Periodo": "25 nov–2 dic", "Tareas": 3, "Completadas": 0, "En curso": 0, "Próximas": 3, "Estado": "Por iniciar"},
    ])
    st.dataframe(fases_df, hide_index=True, use_container_width=True)

    st.markdown("### Acciones Correctivas del Comité (4–7 de Octubre)")
    st.caption("100% cerradas y documentadas en el repositorio")
    ca_df = pd.DataFrame([
        {"Acción": "Descartar variables sin datos", "Responsable": "Sara", "Fecha": "4-oct", "Estado": "Cerrada", "Evidencia": "Informe de variables v2"},
        {"Acción": "Redactar justificación técnica de 138 casos", "Responsable": "Cristóbal", "Fecha": "5-oct", "Estado": "Cerrada", "Evidencia": "Documento metodológico T-09"},
        {"Acción": "Estructurar dataset de entrenamiento", "Responsable": "Cristóbal", "Fecha": "5-oct", "Estado": "Cerrada", "Evidencia": "CSV estandarizado v2"},
        {"Acción": "Unificar escala de 3 niveles", "Responsable": "Julián", "Fecha": "6-oct", "Estado": "Cerrada", "Evidencia": "Diccionario de etiquetas"},
        {"Acción": "Documentar regla 'ante la duda, subir de nivel'", "Responsable": "Sara", "Fecha": "6-oct", "Estado": "Cerrada", "Evidencia": "Acta y criterios de urgencia v2"},
        {"Acción": "Alinear flujo del chatbot con la regla", "Responsable": "Julián", "Fecha": "7-oct", "Estado": "Cerrada", "Evidencia": "Flujo conversacional v2"},
        {"Acción": "Verificar consistencia del árbol de decisión", "Responsable": "Cristóbal", "Fecha": "7-oct", "Estado": "Cerrada", "Evidencia": "Script de validación lógica"}
    ])
    st.dataframe(ca_df, hide_index=True, use_container_width=True)

# -----------------------------------------------------------------------------
# 2. ESTACIÓN DEL VETERINARIO (Lo que ve el médico veterinario)
# -----------------------------------------------------------------------------
elif opcion == "Estación del Veterinario":
    st.markdown("""
        <div class="card-mint">
            <h3 style="margin: 0 0 6px 0; color: #2F614E; font-size: 18px; font-weight: 800;">Estación de Admisión & Triaje Clínico de Urgencias</h3>
            <p style="margin: 0; font-size: 13px; color: #4D594E;">
                Panel de trabajo del médico veterinario: evaluación primaria de constantes fisiológicas, protocolo de estabilización y asignación de boxes asistenciales.
            </p>
        </div>
    """, unsafe_allow_html=True)
    
    modo_trabajo = st.radio("Modo de trabajo:", ["Ficha de Admisión y Evaluación Clínica", "Cola de Pacientes en Espera de Urgencias"], horizontal=True)
    
    if modo_trabajo == "Ficha de Admisión y Evaluación Clínica":
        col_in, col_out = st.columns([1, 1], gap="large")
        
        with col_in:
            st.markdown("#### Ficha de Filiación del Paciente")
            p_nombre = st.text_input("Nombre del paciente:", value="Kira")
            
            c_e1, c_e2, c_e3 = st.columns(3)
            with c_e1:
                p_especie = st.selectbox("Especie:", ["Canino", "Felino"])
            with c_e2:
                p_edad = st.number_input("Edad (Años):", min_value=0, max_value=25, value=4)
            with c_e3:
                p_peso = st.number_input("Peso (kg):", min_value=0.5, max_value=90.0, value=26.5)
                
            st.markdown("#### Examen Primario de Urgencia (Constantes Fisiológicas)")
            c_v1, c_v2, c_v3 = st.columns(3)
            with c_v1:
                fc = st.number_input("FC (lat/min):", value=135, help="Rango canino: 70-140 | felino: 140-220")
            with c_v2:
                fr = st.number_input("FR (resp/min):", value=44, help="Rango fisiológico: 10-30 rpm en reposo")
            with c_v3:
                temp = st.number_input("Temperatura (°C):", value=38.7, step=0.1, help="Rango normal: 38.0 - 39.2 °C")
                
            c_v4, c_v5 = st.columns(2)
            with c_v4:
                mucosas = st.selectbox("Color de Mucosas:", ["Rosadas (Normal)", "Pálidas (Anemia/Shock)", "Cianóticas (Hipoxemia)", "Congestivas (Sepsis/Toxemia)", "Ictéricas (Hemólisis/Hígado)"])
            with c_v5:
                mental = st.selectbox("Estado Mental (Glasgow Modificado):", ["Alerta (Normal)", "Deprimido / Obnubilado", "Estuporoso (Responde sólo al dolor)", "Comatoso (Sin respuesta)"])
                
            p_motivo = st.text_area("Anamnesis y Motivo de Consulta:", value="Traumatismo vehicular con laceración profunda en muslo izquierdo y taquipnea")
            p_duda = st.checkbox("Activar regla clínica precautoria: 'Ante la duda, subir de nivel'")
            
            st.markdown("#### Matriz de Signos de Alarma (22 Criterios)")
            dict_signos = {s["name"]: s["nivel"] for s in URGENCY_SIGNS}
            p_signos = st.multiselect(
                "Signos clínicos detectados:",
                list(dict_signos.keys()),
                default=["Taquipnea sin cianosis (>40 rpm en reposo)", "Herida abierta profunda o laceración"]
            )
            
        with col_out:
            st.markdown("#### Dictamen de Admisión Médica")
            
            tiene_alto = any(dict_signos[s] == "Alto" for s in p_signos)
            tiene_mod = any(dict_signos[s] == "Moderado" for s in p_signos)
            
            # Evaluación por constantes
            vitals_elevan_alto = False
            if p_especie == "Canino" and (fc > 180 or fr > 60 or temp < 36.5 or temp > 40.5):
                vitals_elevan_alto = True
            elif p_especie == "Felino" and (fc > 230 or fc < 120 or temp < 36.0 or temp > 40.5):
                vitals_elevan_alto = True
                
            if mental in ["Estuporoso (Responde sólo al dolor)", "Comatoso (Sin respuesta)"] or "Cianóticas" in mucosas:
                vitals_elevan_alto = True
                
            nivel = "Alto" if (tiene_alto or vitals_elevan_alto) else "Moderado" if tiene_mod else "Bajo"
            escalado = False
            
            # Excepción urológica felina
            if p_especie == "Felino" and "Obstrucción uretral / Anuria dolorosa" in p_signos and nivel != "Alto":
                nivel = "Alto"
                escalado = True
                
            if p_duda:
                if nivel == "Bajo":
                    nivel = "Moderado"
                    escalado = True
                elif nivel == "Moderado":
                    nivel = "Alto"
                    escalado = True
                    
            bg_c = "#FDF0ED" if nivel == "Alto" else "#FFF9F3" if nivel == "Moderado" else "#F4FAF7"
            brd_c = "#F3C3B2" if nivel == "Alto" else "#FDE8D3" if nivel == "Moderado" else "#DAEBE3"
            txt_c = "#7D2A18" if nivel == "Alto" else "#8C5216" if nivel == "Moderado" else "#2F614E"
            box_asig = "Box 1 Reanimación / UCI" if nivel == "Alto" else "Box 2 Procedimientos / Box 3 Urgencias" if nivel == "Moderado" else "Box 4 Observación / Consulta Ambulatoria"
            espera = "Inmediata (< 15 minutos)" if nivel == "Alto" else "Prioritaria (< 60 a 120 minutos)" if nivel == "Moderado" else "Diferible (24 a 48 horas)"
            
            st.markdown(f"""
            <div style="background-color: {bg_c}; border: 2px solid {brd_c}; border-radius: 18px; padding: 22px; margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #657166;">Nivel de Triaje Asignado</span>
                        <h2 style="margin: 4px 0 0 0; font-size: 24px; font-weight: 800; color: {txt_c};">NIVEL {nivel.upper()}</h2>
                    </div>
                    <div>
                        <span style="background-color: {brd_c}; color: {txt_c}; padding: 6px 14px; border-radius: 9999px; font-weight: 800; font-size: 13px;">{nivel}</span>
                    </div>
                </div>
                <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(0,0,0,0.06); font-size: 13px; line-height: 1.6; color: #3D4A3E;">
                    Tiempo máximo para atención médica: <strong>{espera}</strong><br>
                    Box de Destino Asignado: <strong>{box_asig}</strong>
                </div>
            </div>
            """, unsafe_allow_html=True)
            
            if escalado:
                st.markdown("""
                <div class="card-peach" style="padding: 12px; margin-bottom: 14px;">
                    <strong style="color: #8C5216; font-size: 12px;">Regla Precautoria de Seguridad Médica Activa:</strong>
                    <p style="margin: 2px 0 0 0; font-size: 12px; color: #4D594E;">
                        Se activó el principio "Ante la duda, subir de nivel" para evitar infra-triaje y proteger la estabilidad del paciente.
                    </p>
                </div>
                """, unsafe_allow_html=True)
                
            st.markdown("#### Protocolo de Estabilización Inmediata para el Veterinario")
            if nivel == "Alto":
                st.markdown("""
                <div class="card-slate" style="background-color: #535F54; padding: 16px;">
                    <strong style="color: #DAEBE3; font-size: 13px;">Órdenes Médicas Inmediatas:</strong>
                    <ul style="font-size: 12.5px; color: #FFFFFF; margin: 8px 0 0 0; padding-left: 20px; line-height: 1.6;">
                        <li>Vía aérea expedita, decúbito esternal y oxigenoterapia inmediata (flujo libre o mascarilla).</li>
                        <li>Canalización venosa urgente (catéter periférico 18G/20G); extracción para hematocrito, proteínas totales y glucosa.</li>
                        <li>Monitorización cardíaca continua y evaluación ecográfica POCUS / FAST de urgencia.</li>
                        <li>Prohibido suministrar antiinflamatorios o sedantes sin estabilidad circulatoria previa.</li>
                    </ul>
                </div>
                """, unsafe_allow_html=True)
            elif nivel == "Moderado":
                st.markdown("""
                <div class="card-mint" style="padding: 16px;">
                    <strong style="color: #2F614E; font-size: 13px;">Pautas de Manejo en Box de Urgencias:</strong>
                    <ul style="font-size: 12.5px; color: #3D4A3E; margin: 8px 0 0 0; padding-left: 20px; line-height: 1.6;">
                        <li>Aislamiento térmico y reposo en canil bajo supervisión técnica.</li>
                        <li>Re-evaluación seriada de signos vitales cada 30 a 45 minutos.</li>
                        <li>Preparar acceso venoso y analgésicos veterinarios según escala de dolor previa confirmación.</li>
                    </ul>
                </div>
                """, unsafe_allow_html=True)
            else:
                st.markdown("""
                <div class="card-mint" style="padding: 16px;">
                    <strong style="color: #2F614E; font-size: 13px;">Indicaciones de Consulta Externa:</strong>
                    <ul style="font-size: 12.5px; color: #3D4A3E; margin: 8px 0 0 0; padding-left: 20px; line-height: 1.6;">
                        <li>Paciente estable sin compromiso hemodinámico. Derivar a consulta programada.</li>
                        <li>Pautas de alarma al tutor (si vomita >3 veces, colapsa o hay sangrado, reingresar de inmediato).</li>
                    </ul>
                </div>
                """, unsafe_allow_html=True)
                
    else:
        st.markdown("#### Central de Monitoreo · Cola de Pacientes en Espera")
        st.caption("Visualización en tiempo real de ingresos por orden de gravedad y minutos de espera")
        
        q_df = pd.DataFrame(INITIAL_QUEUE)
        st.dataframe(q_df, hide_index=True, use_container_width=True)

# -----------------------------------------------------------------------------
# 3. CRONOGRAMA (39 TAREAS)
# -----------------------------------------------------------------------------
elif opcion == "Cronograma (39 Tareas)":
    st.markdown("""
        <div class="card-blue">
            <h3 style="margin: 0 0 6px 0; color: #1D3D44; font-size: 18px; font-weight: 800;">Cronograma Oficial & Ruta Crítica (39 Tareas)</h3>
            <p style="margin: 0; font-size: 13px; color: #3D4A3E;">
                Línea de base al 12 de octubre de 2026 (Día 35 de 87). Las 16 tareas vencidas están cerradas al 100%.
            </p>
        </div>
    """, unsafe_allow_html=True)
    
    tareas_df = pd.DataFrame([
        {"ID": "T-01", "Tarea": "Definición del problema, objetivos y stakeholders", "Responsable": "Julián", "Fechas": "8–11 sep", "Estado": "Completada", "Ruta Crítica": "Sí"},
        {"ID": "T-02", "Tarea": "Fuentes veterinarias y criterios de urgencia", "Responsable": "Sara", "Fechas": "8–12 sep", "Estado": "Completada", "Ruta Crítica": "No"},
        {"ID": "T-03", "Tarea": "Levantamiento de requisitos (RF y RNF)", "Responsable": "Julián", "Fechas": "13–17 sep", "Estado": "Completada", "Ruta Crítica": "Sí"},
        {"ID": "T-04", "Tarea": "Cronograma y estimación de tiempos", "Responsable": "Julián", "Fechas": "18–20 sep", "Estado": "Completada", "Ruta Crítica": "Sí"},
        {"ID": "T-05", "Tarea": "Definición de fuentes y estructura de datos", "Responsable": "Cristóbal", "Fechas": "18–22 sep", "Estado": "Completada", "Ruta Crítica": "Sí"},
        {"ID": "T-06", "Tarea": "Diseño preliminar del flujo conversacional", "Responsable": "Julián", "Fechas": "18–22 sep", "Estado": "Completada", "Ruta Crítica": "No"},
        {"ID": "T-07", "Tarea": "Selección de modelos a comparar", "Responsable": "Cristóbal", "Fechas": "23–26 sep", "Estado": "Completada", "Ruta Crítica": "Sí"},
        {"ID": "T-08", "Tarea": "Diseño de pruebas del chatbot y criterios", "Responsable": "Sara", "Fechas": "23–26 sep", "Estado": "Completada", "Ruta Crítica": "No"},
        {"ID": "T-09", "Tarea": "Recolección de datos y unificación (138 casos)", "Responsable": "Cristóbal", "Fechas": "27 sep–1 oct", "Estado": "Completada", "Ruta Crítica": "Sí"},
        {"ID": "T-10", "Tarea": "Estructuración de datos y balance", "Responsable": "Cristóbal", "Fechas": "2–4 oct", "Estado": "Completada", "Ruta Crítica": "Sí"},
        {"ID": "T-11", "Tarea": "Validación de datos vs literatura", "Responsable": "Sara", "Fechas": "5–7 oct", "Estado": "Completada", "Ruta Crítica": "No"},
        {"ID": "T-12", "Tarea": "Limpieza de datos", "Responsable": "Cristóbal", "Fechas": "8–10 oct", "Estado": "Completada", "Ruta Crítica": "Sí"},
        {"ID": "T-13", "Tarea": "Transformación de datos y balance", "Responsable": "Cristóbal", "Fechas": "11–13 oct", "Estado": "En curso", "Ruta Crítica": "Sí"},
        {"ID": "T-14", "Tarea": "Etiquetado por nivel de urgencia", "Responsable": "Cristóbal", "Fechas": "14–17 oct", "Estado": "Próxima", "Ruta Crítica": "Sí"},
        {"ID": "T-15", "Tarea": "Feature engineering", "Responsable": "Cristóbal", "Fechas": "18–19 oct", "Estado": "Próxima", "Ruta Crítica": "Sí"},
        {"ID": "T-16", "Tarea": "Entrenamiento de modelos (3)", "Responsable": "Cristóbal", "Fechas": "20–25 oct", "Estado": "Próxima", "Ruta Crítica": "Sí"},
        {"ID": "T-20", "Tarea": "Diseño del flujo del chatbot", "Responsable": "Julián", "Fechas": "23–26 sep", "Estado": "Completada", "Ruta Crítica": "No"},
        {"ID": "T-23", "Tarea": "Implementación de escalamiento", "Responsable": "Julián", "Fechas": "6–9 oct", "Estado": "Completada", "Ruta Crítica": "No"},
        {"ID": "T-35", "Tarea": "Revisión final de desviaciones", "Responsable": "Sara", "Fechas": "29 nov–3 dic", "Estado": "Próxima", "Ruta Crítica": "Sí"},
        {"ID": "T-39", "Tarea": "Cierre formal del proyecto", "Responsable": "Cristóbal", "Fechas": "2–3 dic", "Estado": "Próxima", "Ruta Crítica": "Sí"}
    ])
    st.dataframe(tareas_df, hide_index=True, use_container_width=True)

# -----------------------------------------------------------------------------
# 4. RIESGOS & CALIDAD DE DATOS
# -----------------------------------------------------------------------------
elif opcion == "Riesgos & Calidad de Datos":
    st.markdown("""
        <div class="card-peach">
            <h3 style="margin: 0 0 6px 0; color: #8C5216; font-size: 18px; font-weight: 800;">Matriz de Riesgos v2 (12 Riesgos Reformulados)</h3>
            <p style="margin: 0; font-size: 13px; color: #4D594E;">
                Estrategias de control y mitigación tras el retiro de la clínica y veterinario piloto del 29 de septiembre.
            </p>
        </div>
    """, unsafe_allow_html=True)
    
    r_df = pd.DataFrame([
        {"ID": "R-01", "Riesgo": "Base desbalanceada (21% Alto, 68% Moderado, 11% Bajo)", "Categoría": "Datos", "Nivel": "Alto", "Control": "Pesos de clase y evaluación estratificada (T-10 y T-18)"},
        {"ID": "R-02", "Riesgo": "Tamaño muestral pequeño (138 casos)", "Categoría": "Datos", "Nivel": "Medio", "Control": "Árbol con poda e interpretabilidad para evitar sobreajuste"},
        {"ID": "R-03", "Riesgo": "Retiro de clínica y veterinario piloto", "Categoría": "Clínico", "Nivel": "Alto", "Control": "Validación contra 13 fuentes y regla 'ante la duda, subir de nivel'"},
        {"ID": "R-05", "Riesgo": "Conflicto en hematemesis (vómito con sangre)", "Categoría": "Clínico", "Nivel": "Medio", "Control": "Asignado a nivel ALTO preventivo por acuerdo del comité"},
        {"ID": "R-08", "Riesgo": "Falsos negativos en nivel Alto (Recall < 0.90)", "Categoría": "Clínico", "Nivel": "Alto", "Control": "Meta obligatoria de Recall >= 0.90 en T-18"},
        {"ID": "R-11", "Riesgo": "Ruta crítica sin holgura hasta el 3 de diciembre", "Categoría": "Cronograma", "Nivel": "Alto", "Control": "Monitoreo semanal T-36; activación inmediata si atraso > 1 día"}
    ])
    st.dataframe(r_df, hide_index=True, use_container_width=True)

# -----------------------------------------------------------------------------
# 5. EXPLORADOR DE CASOS (138)
# -----------------------------------------------------------------------------
elif opcion == "Explorador de Casos (138)":
    st.markdown("""
        <div class="card-mint">
            <h3 style="margin: 0 0 6px 0; color: #2F614E; font-size: 18px; font-weight: 800;">Dataset Clínico de 138 Casos</h3>
            <p style="margin: 0; font-size: 13px; color: #4D594E;">
                Auditoría de 71 casos reales de D1 y 67 casos sintéticos de D2. Distribución: 29 Alto, 94 Moderado, 15 Bajo.
            </p>
        </div>
    """, unsafe_allow_html=True)
    
    filtro_nivel = st.selectbox("Filtrar por Nivel de Urgencia:", ["Todos", "Alto", "Moderado", "Bajo"])
    
    casos_data = [
        {"ID": "CASO-001", "Especie": "Canino", "Edad": "4 años", "Fuente": "D1 (Casos Reales)", "Motivo": "Disnea severa y cianosis lingual evidente", "Nivel": "Alto"},
        {"ID": "CASO-002", "Especie": "Felino", "Edad": "2 años", "Fuente": "D1 (Casos Reales)", "Motivo": "Macho sin orinar 18h con quejidos en arenero", "Nivel": "Alto"},
        {"ID": "CASO-003", "Especie": "Canino", "Edad": "8 años", "Fuente": "D1 (Casos Reales)", "Motivo": "Abdomen timpanítico distendido y arcadas improductivas", "Nivel": "Alto"},
        {"ID": "CASO-007", "Especie": "Canino", "Edad": "6 años", "Fuente": "D1 (Casos Reales)", "Motivo": "Vómito con sangre (hematemesis)", "Nivel": "Alto"},
        {"ID": "CASO-030", "Especie": "Canino", "Edad": "5 años", "Fuente": "D1 (Casos Reales)", "Motivo": "Vómitos continuos (4 en 8h)", "Nivel": "Moderado"},
        {"ID": "CASO-031", "Especie": "Felino", "Edad": "4 años", "Fuente": "D2 (Sintético Ampliado)", "Motivo": "Cojera aguda sin apoyo tras caída", "Nivel": "Moderado"},
        {"ID": "CASO-045", "Especie": "Canino", "Edad": "3 años", "Fuente": "D1 (Casos Reales)", "Motivo": "Dolor abdominal agudo moderado a la palpación", "Nivel": "Moderado"},
        {"ID": "CASO-080", "Especie": "Felino", "Edad": "1 año", "Fuente": "D2 (Sintético Ampliado)", "Motivo": "Letargia y deshidratación estimada en 8%", "Nivel": "Moderado"},
        {"ID": "CASO-124", "Especie": "Canino", "Edad": "1 año", "Fuente": "D2 (Sintético Ampliado)", "Motivo": "Diarrea blanda matutina única sin vómitos", "Nivel": "Bajo"},
        {"ID": "CASO-135", "Especie": "Felino", "Edad": "2 años", "Fuente": "D2 (Sintético Ampliado)", "Motivo": "Diarrea acuosa leve única, apetito conservado", "Nivel": "Bajo"},
    ]
    
    if filtro_nivel != "Todos":
        casos_data = [c for c in casos_data if c["Nivel"] == filtro_nivel]
        
    st.dataframe(pd.DataFrame(casos_data), hide_index=True, use_container_width=True)
