"""
Vet-Triage · Sistema de Triaje de Urgencia Veterinaria
Informe Consolidado de Avance & Simulador Clínico
Paleta oficial:
  - #99CDD8 (Azul celeste veterinario)
  - #DAEBE3 (Menta suave / fondo de tarjetas)
  - #FDE8D3 (Melocotón / advertencia cálida)
  - #F3C3B2 (Salmón coral / urgencia alta)
  - #CFD6C4 (Gris salvia / bordes y neutro)
  - #657166 (Verde pizarra profundo / textos principales)
"""

import streamlit as st
import pandas as pd

# -----------------------------------------------------------------------------
# Configuración inicial de Streamlit
# -----------------------------------------------------------------------------
st.set_page_config(
    page_title="Vet-Triage · Informe y Motor Clínico",
    page_icon="🐾",
    layout="wide",
    initial_sidebar_state="expanded"
)

# -----------------------------------------------------------------------------
# Inyección de estilos CSS con la paleta de colores personalizada
# -----------------------------------------------------------------------------
st.markdown("""
<style>
    /* Tipografía y fondo global */
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        color: #3D4A3E;
    }
    
    .stApp {
        background-color: #FAFBF9;
    }

    /* Barra lateral */
    [data-testid="stSidebar"] {
        background: linear-gradient(180deg, #F0F4F1 0%, #E6EDE8 100%);
        border-right: 1px solid #CFD6C4;
    }

    /* Tarjeta Hero Principal */
    .hero-card {
        background: linear-gradient(135deg, #657166 0%, #4D594E 100%);
        color: #FFFFFF;
        padding: 30px;
        border-radius: 20px;
        box-shadow: 0 10px 25px rgba(101, 113, 102, 0.15);
        margin-bottom: 24px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .hero-badge-green {
        background-color: rgba(218, 235, 227, 0.25);
        color: #DAEBE3;
        border: 1px solid rgba(218, 235, 227, 0.4);
        padding: 4px 12px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 600;
        display: inline-block;
        margin-right: 8px;
    }
    .hero-badge-yellow {
        background-color: rgba(253, 232, 211, 0.25);
        color: #FDE8D3;
        border: 1px solid rgba(253, 232, 211, 0.4);
        padding: 4px 12px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 600;
        display: inline-block;
    }
    .hero-title {
        color: #FFFFFF !important;
        font-size: 28px;
        font-weight: 800;
        margin: 16px 0 8px 0;
        letter-spacing: -0.5px;
    }
    .hero-text {
        color: #DAEBE3;
        font-size: 14px;
        line-height: 1.6;
        max-width: 900px;
    }

    /* Tarjetas de Métricas / KPIs */
    .metric-box {
        background-color: #FFFFFF;
        border: 1px solid #CFD6C4;
        border-radius: 16px;
        padding: 18px 20px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.03);
        margin-bottom: 12px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .metric-box:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 14px rgba(101, 113, 102, 0.08);
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

    /* Tarjetas temáticas con la paleta */
    .card-peach {
        background-color: #FFF8F2;
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
    .card-white {
        background-color: #FFFFFF;
        border: 1px solid #CFD6C4;
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 16px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.02);
    }

    /* Badges de nivel de triaje */
    .badge-alto {
        background-color: #F3C3B2;
        color: #7D2A18;
        padding: 6px 14px;
        border-radius: 9999px;
        font-weight: 800;
        font-size: 13px;
        display: inline-block;
        border: 1px solid #E8A894;
    }
    .badge-moderado {
        background-color: #FDE8D3;
        color: #8C5216;
        padding: 6px 14px;
        border-radius: 9999px;
        font-weight: 800;
        font-size: 13px;
        display: inline-block;
        border: 1px solid #F3CFAB;
    }
    .badge-bajo {
        background-color: #DAEBE3;
        color: #2F614E;
        padding: 6px 14px;
        border-radius: 9999px;
        font-weight: 800;
        font-size: 13px;
        display: inline-block;
        border: 1px solid #BDD9CE;
    }

    /* Botones de acción */
    .stButton>button {
        background-color: #99CDD8 !important;
        color: #244147 !important;
        font-weight: 700 !important;
        border-radius: 12px !important;
        border: none !important;
        padding: 10px 22px !important;
        box-shadow: 0 3px 8px rgba(153, 205, 216, 0.3) !important;
        transition: all 0.2s ease !important;
    }
    .stButton>button:hover {
        background-color: #86BDC9 !important;
        color: #172F34 !important;
        transform: translateY(-1px);
        box-shadow: 0 5px 12px rgba(153, 205, 216, 0.45) !important;
    }

    /* Headers generales */
    h1, h2, h3, h4 {
        color: #3D4A3E !important;
        font-weight: 700;
    }
</style>
""", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# Catálogo oficial de los 22 Signos de Urgencia Clínica
# -----------------------------------------------------------------------------
URGENCY_SIGNS = [
    # 12 Sólidos (OE1)
    {"id": "s-01", "name": "Dificultad respiratoria severa / Cianosis / Ortopnea", "nivel": "Alto", "categoria": "Sólido (13 fuentes)", "desc": "Boca abierta, esfuerzo abdominal, mucosas cianóticas o pálidas."},
    {"id": "s-02", "name": "Paro cardiorrespiratorio o colapso agudo sin respuesta", "nivel": "Alto", "categoria": "Sólido", "desc": "Inconsciencia súbita, ausencia de pulso o respiración agónica."},
    {"id": "s-03", "name": "Convulsiones activas continuas o en racimo (>3 min)", "nivel": "Alto", "categoria": "Sólido", "desc": "Estatus epiléptico continuo sin recuperar consciencia."},
    {"id": "s-04", "name": "Trauma de alto impacto / Atropellamiento vehicular", "nivel": "Alto", "categoria": "Sólido", "desc": "Sospecha de hemorragia interna, neumotórax o fracturas graves."},
    {"id": "s-05", "name": "Hemorragia arterial o profusa no controlable", "nivel": "Alto", "categoria": "Sólido", "desc": "Sangrado pulsátil activo que no cede a la compresión."},
    {"id": "s-06", "name": "Sospecha de Dilatación-Torsión Gástrica (GDV)", "nivel": "Alto", "categoria": "Sólido", "desc": "Abdomen timpanítico distendido, náuseas improductivas, inquietud."},
    {"id": "s-07", "name": "Obstrucción uretral aguda / Anuria dolorosa", "nivel": "Alto", "categoria": "Sólido", "desc": "Imposibilidad para emitir orina (muy crítico en machos felinos)."},
    {"id": "s-08", "name": "Estupor profundo, coma o falta total de respuesta", "nivel": "Alto", "categoria": "Sólido", "desc": "Incapacidad para incorporarse o responder a estímulos."},
    {"id": "s-09", "name": "Hipotermia extrema (<36°C) o Golpe de calor (>41°C)", "nivel": "Alto", "categoria": "Sólido", "desc": "Descompensación térmica extrema con riesgo de fallo multiorgánico."},
    {"id": "s-10", "name": "Intoxicación aguda conocida (rodenticidas, lirios, etc.)", "nivel": "Alto", "categoria": "Sólido", "desc": "Ingesta reciente de sustancias tóxicas letales."},
    {"id": "s-11", "name": "Quemaduras de 2do/3er grado extensas (>15% corporal)", "nivel": "Alto", "categoria": "Sólido", "desc": "Lesiones térmicas extensas con riesgo de shock hipovolémico."},
    {"id": "s-12", "name": "Proptosis ocular o perforación corneal aguda", "nivel": "Alto", "categoria": "Sólido", "desc": "Globo ocular fuera de la órbita o traumatismo penetrante."},

    # 8 con Umbral por contrastar
    {"id": "s-13", "name": "Taquipnea moderada sin cianosis (>40 rpm en reposo)", "nivel": "Moderado", "categoria": "Umbral por contrastar", "desc": "Respiración acelerada pero con mucosas rosadas."},
    {"id": "s-14", "name": "Dolor abdominal agudo sin distensión masiva", "nivel": "Moderado", "categoria": "Umbral por contrastar", "desc": "Postura de rezo, sensibilidad a la palpación, abdomen blando."},
    {"id": "s-15", "name": "Vómitos repetidos (>3 episodios en 12 horas)", "nivel": "Moderado", "categoria": "Umbral por contrastar", "desc": "Riesgo de deshidratación y desequilibrio electrolítico."},
    {"id": "s-16", "name": "Cojera aguda sin apoyo (sospecha fractura cerrada)", "nivel": "Moderado", "categoria": "Umbral por contrastar", "desc": "Imposibilidad para apoyar la extremidad sin exposición ósea externa."},
    {"id": "s-17", "name": "Herida abierta profunda o laceración cutánea", "nivel": "Moderado", "categoria": "Umbral por contrastar", "desc": "Pérdida de continuidad dérmica amplia sin compromiso vascular mayor."},
    {"id": "s-18", "name": "Letargia marcada con deshidratación clínica (>7%)", "nivel": "Moderado", "categoria": "Umbral por contrastar", "desc": "Retardo en pliegue cutáneo >3s y encías secas."},
    {"id": "s-19", "name": "Diarrea hemorrágica abundante sin shock", "nivel": "Moderado", "categoria": "Umbral por contrastar", "desc": "Heces líquidas con sangre en animal activo y consciente."},
    {"id": "s-20", "name": "Disuria o hematuria con micción presente", "nivel": "Moderado", "categoria": "Umbral por contrastar", "desc": "Dificultad o dolor pero produce chorro comprobado de orina."},

    # 1 en Conflicto
    {"id": "s-21", "name": "Vómito con sangre visible (Hematemesis)", "nivel": "Alto", "categoria": "En conflicto (Regla de oro: Subir a ALTO)", "desc": "Asignado a ALTO preventivo por regla de oro 'ante la duda, subir de nivel'."},

    # 1 sin Fuente
    {"id": "s-22", "name": "Diarrea acuosa aislada (sin vómito, alerta)", "nivel": "Bajo", "categoria": "Sin fuente (Declarado como limitación)", "desc": "Episodio digestivo leve autolimitado sin compromiso sistémico."}
]

# -----------------------------------------------------------------------------
# Motor Clínico de Triaje
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
    
    # Hematemesis en conflicto
    if any(s["id"] == "s-21" for s in signos_obj):
        reglas_aplicadas.append("Regla de conflicto clínico (T-11): Hematemesis clasificada preventivamente en ALTO.")
        
    # Felino con dificultad urinaria
    if especie == "Felino" and any(s["id"] in ["s-07", "s-20"] for s in signos_obj) and nivel_final != "Alto":
        nivel_final = "Alto"
        escalado = True
        reglas_aplicadas.append("Regla de riesgo felino: Dificultad urinaria en gato escala a ALTO por riesgo de uretrostomía/bloqueo mortal.")
        
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
            
    if nivel_final == "Alto":
        espera = "Inmediata (< 15 minutos)"
        badge_class = "badge-alto"
        recs = [
            "🔴 Mantener al paciente en posición esternal con cuello extendido y vía aérea permeable.",
            "🔴 Prohibido administrar comida, leche o medicamentos orales humanos (paracetamol/ibuprofeno).",
            "🔴 Trasladar inmediatamente en transportín rígido o manta estabilizadora manteniendo temperatura.",
            "🔴 Comunicarse de inmediato con el centro de urgencias 24h para preparar box de reanimación."
        ]
    elif nivel_final == "Moderado":
        espera = "Prioritaria (< 60 a 120 minutos)"
        badge_class = "badge-moderado"
        recs = [
            "🟡 Mantener en reposo absoluto en un ambiente tranquilo y templado.",
            "🟡 Retirar acceso a raciones grandes de comida; permitir pequeños sorbos de agua si no hay vómitos activos.",
            "🟡 Monitorear frecuencia respiratoria en reposo (contar respiraciones en 1 minuto).",
            "🟡 Observar coloración de encías (deben ser rosadas, no blancas ni azuladas)."
        ]
    else:
        espera = "Diferible / Ambulatoria (24 a 48 horas)"
        badge_class = "badge-bajo"
        recs = [
            "🟢 Monitorear ingesta voluntaria de agua y apetito durante las próximas 12-24 horas.",
            "🟢 Dieta blanda de fácil digestión previa indicación veterinaria.",
            "🟢 Consultar de urgencia si aparecen vómitos frecuentes o letargia severa."
        ]
        
    return {
        "nivel": nivel_final,
        "espera": espera,
        "badge_class": badge_class,
        "reglas": reglas_aplicadas,
        "recomendaciones": recs,
        "escalado": escalado,
        "signos": signos_obj
    }

# -----------------------------------------------------------------------------
# Menú de Navegación Lateral (Estilizado)
# -----------------------------------------------------------------------------
with st.sidebar:
    st.markdown("""
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
            <div style="width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #99CDD8, #657166); display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">
                🐾
            </div>
            <div>
                <h2 style="margin: 0; font-size: 20px; font-weight: 800; color: #3D4A3E;">Vet-Triage</h2>
                <span style="font-size: 11px; color: #657166; font-weight: 600;">Informe & Motor Clínico</span>
            </div>
        </div>
    """, unsafe_allow_html=True)
    
    st.caption("José Julián Sierra · Cristóbal Andrés Patiño · Sara Sofía Blanco")
    st.markdown("---")
    
    opcion = st.radio(
        "Navegación:",
        [
            "📊 Informe & KPIs",
            "🩺 Simulador de Triaje",
            "📅 Cronograma (39 Tareas)",
            "⚠️ Riesgos & Datos",
            "📁 Casos Clínicos (138)"
        ]
    )
    
    st.markdown("---")
    st.markdown("""
        <div class="card-peach" style="padding: 12px; margin: 0;">
            <strong style="color: #8C5216; font-size: 12px; display: block; margin-bottom: 4px;">🟡 Semáforo: Amarillo</strong>
            <span style="font-size: 11px; color: #657166;">Corte: <strong>12-oct-2026</strong> (Día 35/87)<br>Avance ponderado: <strong>50,0 %</strong> (Índice 1,00)</span>
        </div>
    """, unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# 1. INFORME & KPIS
# -----------------------------------------------------------------------------
if opcion == "📊 Informe & KPIs":
    # Hero Card
    st.markdown("""
    <div class="hero-card">
        <div>
            <span class="hero-badge-green">✓ Al día con el Cronograma Oficial</span>
            <span class="hero-badge-yellow">⚠️ Semáforo Amarillo (Riesgo Estructural)</span>
            <span style="font-size: 12px; color: #DAEBE3; margin-left: 8px;">Día 35 de 87 (40,2% del tiempo)</span>
        </div>
        <div class="hero-title">Vet-Triage: Informe Consolidado de Avance</div>
        <div class="hero-text">
            El equipo conformado por <strong>José Julián Sierra</strong> (líder y chatbot), <strong>Cristóbal Andrés Patiño</strong> (datos y modelos) y <strong>Sara Sofía Blanco</strong> (QA y criterios de urgencia) cumple al 100% las 16 tareas vencidas al corte del 12 de octubre de 2026. El avance ponderado se sitúa en <strong>50,0 %</strong> (Índice 1,00). El proyecto permanece en alerta amarilla debido a la validación sin veterinario presencial, el desbalance del dataset (138 casos) y la ruta crítica sin holgura.
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # Metric cards row
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        st.markdown("""
        <div class="metric-box">
            <div class="metric-label">Avance Ponderado</div>
            <div class="metric-value">
                50,0 %
                <span class="metric-tag" style="background-color: #DAEBE3; color: #2F614E;">Índice 1,00</span>
            </div>
            <div class="metric-desc">Planeado: 50,0 % · 65 de 134 días-tarea</div>
        </div>
        """, unsafe_allow_html=True)
        
    with c2:
        st.markdown("""
        <div class="metric-box">
            <div class="metric-label">Tareas Vencidas</div>
            <div class="metric-value">
                16 / 16
                <span class="metric-tag" style="background-color: #99CDD8; color: #244147;">100 % cerradas</span>
            </div>
            <div class="metric-desc">Cero tareas pendientes atrasadas</div>
        </div>
        """, unsafe_allow_html=True)
        
    with c3:
        st.markdown("""
        <div class="metric-box">
            <div class="metric-label">Signos Sólidos</div>
            <div class="metric-value">
                12 / 22
                <span class="metric-tag" style="background-color: #DAEBE3; color: #2F614E;">Cumple OE1</span>
            </div>
            <div class="metric-desc">12 signos sólidos; 10 son limitaciones</div>
        </div>
        """, unsafe_allow_html=True)
        
    with c4:
        st.markdown("""
        <div class="metric-box">
            <div class="metric-label">Holgura Ruta Crítica</div>
            <div class="metric-value" style="color: #7D2A18;">
                0 días
                <span class="metric-tag" style="background-color: #F3C3B2; color: #7D2A18;">Alerta R11</span>
            </div>
            <div class="metric-desc">T-35 finaliza el 3-dic sin margen</div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)
    
    col_izq, col_der = st.columns(2)
    with col_izq:
        st.markdown("""
        <div class="card-peach">
            <h4 style="margin: 0 0 10px 0; color: #8C5216;">🟡 Semáforo Amarillo: Causas Estructurales</h4>
            <div style="font-size: 13px; color: #4D594E; line-height: 1.6;">
                <strong>1. Base pequeña y desbalanceada:</strong> 138 casos (29 Alto, 94 Moderado, 15 Bajo provenientes de D2 sintético). Esto condiciona la fiabilidad del Recall ≥ 0,90.<br><br>
                <strong>2. Validación sin veterinario presencial:</strong> Retiro de clínica piloto el 29-sep. Se compensa contrastando con 13 fuentes y aplicando la regla <em>'ante la duda, subir de nivel'</em>.<br><br>
                <strong>3. Ruta crítica sin holgura:</strong> Cristóbal concentra la cadena de datos (T-09 a T-19) hasta el cierre el 3 de diciembre.
            </div>
        </div>
        """, unsafe_allow_html=True)
        
    with col_der:
        st.markdown("""
        <div class="card-blue">
            <h4 style="margin: 0 0 10px 0; color: #244147;">📋 Cambio de Alcance (Comité del 29-sep)</h4>
            <div style="font-size: 13px; color: #3D4A3E; line-height: 1.6;">
                <strong>• Qué cambió:</strong> Se retiró la clínica y veterinario piloto. Tareas renombradas: T-02, T-09, T-11, T-34 y T-35 manteniendo su ID.<br><br>
                <strong>• Mecanismo de compensación:</strong> Regla 'ante la duda, subir de nivel', marcación de casos sintéticos y declaración formal de limitaciones.<br><br>
                <strong>• Cronograma y costos:</strong> Sin cambios en la fecha de finalización (3-dic) ni presupuesto previsto.
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

# -----------------------------------------------------------------------------
# 2. SIMULADOR CLÍNICO DE TRIAJE
# -----------------------------------------------------------------------------
elif opcion == "🩺 Simulador de Triaje":
    st.markdown("""
        <div class="card-mint">
            <h3 style="margin: 0 0 6px 0; color: #2F614E;">🩺 Simulador Clínico de Triaje Veterinario</h3>
            <p style="margin: 0; font-size: 13px; color: #4D594E;">
                Implementación interactiva de las tareas T-20 a T-23 con los 22 signos de referencia y la regla de oro: <strong>"Ante la duda, subir de nivel"</strong>.
            </p>
        </div>
    """, unsafe_allow_html=True)
    
    col_in, col_out = st.columns([1, 1], gap="large")
    
    with col_in:
        st.markdown("#### Datos del Paciente")
        nombre_pet = st.text_input("Nombre de la mascota:", value="Max")
        col_e1, col_e2 = st.columns(2)
        with col_e1:
            especie_sel = st.selectbox("Especie:", ["Canino", "Felino"])
        with col_e2:
            edad_sel = st.number_input("Edad (Años):", min_value=0, max_value=25, value=4)
            
        motivo_sel = st.text_area("Motivo de consulta reportado por el tutor:", value="Dificultad respiratoria súbita y lengua azulada")
        
        duda_check = st.checkbox("⚠️ Activar regla: 'Ante la duda, subir de nivel' (caso limítrofe o sospecha clínica)")
        
        st.markdown("#### Selección de Signos Clínicos Observados")
        dict_signos = {f"{s['name']} ({s['nivel']})": s["id"] for s in URGENCY_SIGNS}
        signos_seleccionados = st.multiselect(
            "Marcar signos presentes:",
            options=list(dict_signos.keys()),
            default=["Dificultad respiratoria severa / Cianosis / Ortopnea (Alto)"]
        )
        ids_elegidos = [dict_signos[s] for s in signos_seleccionados]
        
    with col_out:
        st.markdown("#### Dictamen de Triaje Clínico")
        res = evaluar_triaje(especie_sel, motivo_sel, ids_elegidos, duda_check)
        
        # Output Card
        color_fondo = "#FDF0ED" if res["nivel"] == "Alto" else "#FFFBF5" if res["nivel"] == "Moderado" else "#F4FAF7"
        color_borde = "#F3C3B2" if res["nivel"] == "Alto" else "#FDE8D3" if res["nivel"] == "Moderado" else "#DAEBE3"
        
        st.markdown(f"""
        <div style="background-color: {color_fondo}; border: 2px solid {color_borde}; border-radius: 18px; padding: 22px; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #657166; letter-spacing: 0.8px;">Prioridad Asignada</span>
                    <h2 style="margin: 4px 0 0 0; font-size: 26px; font-weight: 800;">NIVEL {res['nivel'].upper()}</h2>
                </div>
                <div>
                    <span class="{res['badge_class']}">Nivel {res['nivel']}</span>
                </div>
            </div>
            <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(0,0,0,0.06); font-size: 13px; font-weight: 600; color: #3D4A3E;">
                ⏱️ Tiempo máximo de atención: <strong>{res['espera']}</strong>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        if res["escalado"]:
            st.markdown("""
            <div class="card-peach" style="padding: 12px; margin-bottom: 12px;">
                <strong style="color: #8C5216; font-size: 12px;">🛡️ Regla del Comité Aplicada:</strong>
                <p style="margin: 2px 0 0 0; font-size: 12px; color: #4D594E;">
                    "Ante la duda, subir de nivel". El nivel fue elevado preventivamente para proteger al paciente.
                </p>
            </div>
            """, unsafe_allow_html=True)
            
        if res["reglas"]:
            st.markdown("**Reglas clínicas aplicadas:**")
            for r in res["reglas"]:
                st.caption(f"⚖️ {r}")
                
        st.markdown("#### Recomendaciones Inmediatas (T-22)")
        for rec in res["recomendaciones"]:
            st.markdown(f"<div style='font-size: 13px; margin-bottom: 6px;'>{rec}</div>", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# 3. CRONOGRAMA GANTT (39 TAREAS)
# -----------------------------------------------------------------------------
elif opcion == "📅 Cronograma (39 Tareas)":
    st.markdown("""
        <div class="card-blue">
            <h3 style="margin: 0 0 6px 0; color: #244147;">📅 Cronograma Oficial & Ruta Crítica (39 Tareas)</h3>
            <p style="margin: 0; font-size: 13px; color: #3D4A3E;">
                Al corte del 12 de octubre de 2026 (Día 35 de 87), las 16 tareas vencidas están 100% completadas. La ruta crítica tiene <strong>0 días de holgura</strong>.
            </p>
        </div>
    """, unsafe_allow_html=True)
    
    tareas_data = [
        {"ID": "T-01", "Tarea": "Definición del problema y stakeholders", "Fase": "1. Iniciación", "Responsable": "Julián", "Fechas": "8–11 sep", "Estado": "Completada", "RutaCrítica": True},
        {"ID": "T-02", "Tarea": "Fuentes veterinarias y criterios de urgencia", "Fase": "1. Iniciación", "Responsable": "Sara", "Fechas": "8–12 sep", "Estado": "Completada", "RutaCrítica": False},
        {"ID": "T-03", "Tarea": "Levantamiento de requisitos (RF y RNF)", "Fase": "1. Iniciación", "Responsable": "Julián", "Fechas": "13–17 sep", "Estado": "Completada", "RutaCrítica": True},
        {"ID": "T-04", "Tarea": "Cronograma y estimación de tiempos", "Fase": "2. Planeación", "Responsable": "Julián", "Fechas": "18–20 sep", "Estado": "Completada", "RutaCrítica": True},
        {"ID": "T-05", "Tarea": "Definición de fuentes y datos", "Fase": "2. Planeación", "Responsable": "Cristóbal", "Fechas": "18–22 sep", "Estado": "Completada", "RutaCrítica": False},
        {"ID": "T-08", "Tarea": "Plan de riesgos y contingencia (Matriz v2)", "Fase": "2. Planeación", "Responsable": "Sara", "Fechas": "21–23 sep", "Estado": "Completada", "RutaCrítica": False},
        {"ID": "T-09", "Tarea": "Recolección de datos (138 casos)", "Fase": "3. Ejecución", "Responsable": "Cristóbal", "Fechas": "27 sep–1 oct", "Estado": "Completada", "RutaCrítica": True},
        {"ID": "T-10", "Tarea": "Estructuración de datos y balance", "Fase": "3. Ejecución", "Responsable": "Cristóbal", "Fechas": "2–4 oct", "Estado": "Completada", "RutaCrítica": True},
        {"ID": "T-11", "Tarea": "Validación de datos vs literatura", "Fase": "3. Ejecución", "Responsable": "Sara", "Fechas": "5–7 oct", "Estado": "Completada", "RutaCrítica": False},
        {"ID": "T-12", "Tarea": "Limpieza de datos", "Fase": "3. Ejecución", "Responsable": "Cristóbal", "Fechas": "8–10 oct", "Estado": "Completada", "RutaCrítica": True},
        {"ID": "T-13", "Tarea": "Transformación de datos", "Fase": "3. Ejecución", "Responsable": "Cristóbal", "Fechas": "11–13 oct", "Estado": "En curso", "RutaCrítica": True},
        {"ID": "T-14", "Tarea": "Etiquetado por nivel de urgencia", "Fase": "3. Ejecución", "Responsable": "Cristóbal", "Fechas": "14–17 oct", "Estado": "Próxima", "RutaCrítica": True},
        {"ID": "T-16", "Tarea": "Entrenamiento de modelos (al menos 3)", "Fase": "3. Ejecución", "Responsable": "Cristóbal", "Fechas": "20–25 oct", "Estado": "Próxima", "RutaCrítica": True},
        {"ID": "T-20", "Tarea": "Diseño del flujo del chatbot", "Fase": "3. Ejecución", "Responsable": "Julián", "Fechas": "23–26 sep", "Estado": "Completada", "RutaCrítica": False},
        {"ID": "T-21", "Tarea": "Implementación de preguntas", "Fase": "3. Ejecución", "Responsable": "Julián", "Fechas": "27 sep–1 oct", "Estado": "Completada", "RutaCrítica": False},
        {"ID": "T-22", "Tarea": "Implementación de recomendaciones", "Fase": "3. Ejecución", "Responsable": "Julián", "Fechas": "2–5 oct", "Estado": "Completada", "RutaCrítica": False},
        {"ID": "T-23", "Tarea": "Implementación de escalamiento", "Fase": "3. Ejecución", "Responsable": "Julián", "Fechas": "6–9 oct", "Estado": "Completada", "RutaCrítica": False},
        {"ID": "T-24", "Tarea": "Integración del modelo en el flujo", "Fase": "3. Ejecución", "Responsable": "Julián", "Fechas": "4–7 nov", "Estado": "Próxima", "RutaCrítica": True},
        {"ID": "T-35", "Tarea": "Revisión final de desviaciones", "Fase": "4. Seguimiento y control", "Responsable": "Sara", "Fechas": "29 nov–3 dic", "Estado": "Próxima", "RutaCrítica": True},
        {"ID": "T-36", "Tarea": "Control de avance, riesgos y métricas", "Fase": "4. Seguimiento y control", "Responsable": "Julián", "Fechas": "Continua", "Estado": "En curso", "RutaCrítica": False},
        {"ID": "T-39", "Tarea": "Cierre formal y lecciones aprendidas", "Fase": "5. Cierre", "Responsable": "Cristóbal", "Fechas": "2–3 dic", "Estado": "Próxima", "RutaCrítica": True},
    ]
    df_t = pd.DataFrame(tareas_data)
    
    col_f1, col_f2 = st.columns(2)
    with col_f1:
        f_resp = st.selectbox("Filtrar por Responsable:", ["Todos", "Julián", "Cristóbal", "Sara"])
    with col_f2:
        f_crit = st.checkbox("🔥 Ver solo tareas de la Ruta Crítica")
        
    df_f = df_t.copy()
    if f_resp != "Todos":
        df_f = df_f[df_f["Responsable"] == f_resp]
    if f_crit:
        df_f = df_f[df_f["RutaCrítica"] == True]
        
    st.dataframe(df_f, hide_index=True, use_container_width=True)

# -----------------------------------------------------------------------------
# 4. RIESGOS & DATOS
# -----------------------------------------------------------------------------
elif opcion == "⚠️ Riesgos & Datos":
    st.markdown("""
        <div class="card-peach">
            <h3 style="margin: 0 0 6px 0; color: #8C5216;">⚠️ Matriz de Riesgos v2 & 22 Signos Clínicos</h3>
            <p style="margin: 0; font-size: 13px; color: #4D594E;">
                12 riesgos reformulados sin veterinario presencial y catálogo de 22 signos estructurados por solidez científica.
            </p>
        </div>
    """, unsafe_allow_html=True)
    
    tab1, tab2 = st.tabs(["Matriz de Riesgos v2 (12)", "Catálogo de los 22 Signos"])
    
    with tab1:
        riesgos_v2 = [
            {"ID": "R-01", "Riesgo": "Base desbalanceada (21% Alto, 68% Moderado, 11% Bajo)", "Categoría": "Datos", "Severidad": "Alto", "Estado": "Mitigado", "Mitigación": "Pesos por clase y validación estratificada (T-10)."},
            {"ID": "R-02", "Riesgo": "Tamaño muestral pequeño (138 casos)", "Categoría": "Datos", "Severidad": "Medio", "Estado": "Vigente", "Mitigación": "Modelos con poda para evitar sobreajuste en CPU local."},
            {"ID": "R-03", "Riesgo": "Retiro de clínica y veterinario piloto", "Categoría": "Clínico", "Severidad": "Alto", "Estado": "Mitigado", "Mitigación": "Contraste con 13 fuentes y regla 'ante la duda subir de nivel'."},
            {"ID": "R-05", "Riesgo": "Conflicto en hematemesis (vómito con sangre)", "Categoría": "Clínico", "Severidad": "Medio", "Estado": "Cerrado", "Mitigación": "Asignado a nivel ALTO por acuerdo del comité."},
            {"ID": "R-08", "Riesgo": "Falsos negativos en nivel Alto (Recall < 0.90)", "Categoría": "Clínico", "Severidad": "Alto", "Estado": "Vigente", "Mitigación": "Meta obligatoria de Recall >= 0.90 evaluada en T-18."},
            {"ID": "R-11", "Riesgo": "Ruta crítica sin holgura hasta el 3 de diciembre", "Categoría": "Cronograma", "Severidad": "Alto", "Estado": "Vigente", "Mitigación": "Control semanal T-36; activación si atraso > 1 día."},
        ]
        st.dataframe(pd.DataFrame(riesgos_v2), hide_index=True, use_container_width=True)
        
    with tab2:
        st.dataframe(pd.DataFrame(URGENCY_SIGNS)[["name", "nivel", "categoria", "desc"]], hide_index=True, use_container_width=True)

# -----------------------------------------------------------------------------
# 5. CASOS CLÍNICOS (138)
# -----------------------------------------------------------------------------
elif opcion == "📁 Casos Clínicos (138)":
    st.markdown("""
        <div class="card-mint">
            <h3 style="margin: 0 0 6px 0; color: #2F614E;">📁 Dataset Clínico de 138 Casos</h3>
            <p style="margin: 0; font-size: 13px; color: #4D594E;">
                71 casos de D1 (Casos Reales) y 67 casos de D2 (Sintético Ampliado). Distribución: 29 Alto, 94 Moderado y 15 Bajo.
            </p>
        </div>
    """, unsafe_allow_html=True)
    
    casos_muestra = [
        {"ID": "CASO-001", "Especie": "Canino", "Edad": "4 años", "Fuente": "D1 Real", "Motivo": "Disnea severa y cianosis lingual", "Nivel": "Alto", "Regla": "Signo crítico DIF_RESP_SEV"},
        {"ID": "CASO-002", "Especie": "Felino", "Edad": "2 años", "Fuente": "D1 Real", "Motivo": "Macho sin orinar 18h en arenero", "Nivel": "Alto", "Regla": "Obstrucción uretral felina"},
        {"ID": "CASO-003", "Especie": "Canino", "Edad": "8 años", "Fuente": "D1 Real", "Motivo": "Abdomen timpanítico y arcadas improductivas", "Nivel": "Alto", "Regla": "Sospecha torsión gástrica GDV"},
        {"ID": "CASO-007", "Especie": "Canino", "Edad": "6 años", "Fuente": "D1 Real", "Motivo": "Vómito con sangre (hematemesis)", "Nivel": "Alto", "Regla": "Principio 'ante la duda, subir de nivel'"},
        {"ID": "CASO-030", "Especie": "Canino", "Edad": "5 años", "Fuente": "D1 Real", "Motivo": "Vómitos continuos (4 en 8h)", "Nivel": "Moderado", "Regla": "Umbral >3 vómitos sin shock"},
        {"ID": "CASO-031", "Especie": "Felino", "Edad": "4 años", "Fuente": "D2 Sintético", "Motivo": "Cojera aguda sin apoyo", "Nivel": "Moderado", "Regla": "Sospecha fractura cerrada"},
        {"ID": "CASO-124", "Especie": "Canino", "Edad": "1 año", "Fuente": "D2 Sintético", "Motivo": "Diarrea blanda matutina única", "Nivel": "Bajo", "Regla": "Cuadro digestivo leve aislado"},
    ]
    st.dataframe(pd.DataFrame(casos_muestra), hide_index=True, use_container_width=True)
