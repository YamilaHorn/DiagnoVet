diagnoVET UI Engineer Challenge - Prototipo de Evolución Técnica 🐾

Este repositorio contiene mi propuesta para el UI Engineer Challenge de diagnoVET. He desarrollado un prototipo funcional que aborda los puntos de fricción detectados en la plataforma actual, enfocándome en mejorar la eficiencia operativa del veterinario mediante una interfaz de alta fidelidad.

🔗 Demo en Vivo
https://diagnovett.netlify.app

* Tras realizar una auditoría detallada de los flujos de trabajo presentados en los videos de la plataforma, identifiqué los siguientes puntos críticos de fricción que comprometen la eficiencia del profesional:

* Formularios Extensos y Lineales: La estructura actual presenta formularios excesivamente largos que saturan la interfaz, obligando al veterinario a realizar un scroll constante y aumentando la posibilidad de omitir datos críticos durante la consulta.

* Gestión Fragmentada de Datos: La desconexión entre la carga de archivos multimedia y el registro de observaciones diagnósticas dificulta una visión integral del caso en tiempo real.


* Riesgo de Errores por Transcripción: Al no contar con herramientas de asistencia directa, el profesional debe recordar detalles técnicos para transcribirlos posteriormente, lo que aumenta el riesgo de imprecisiones en el diagnóstico final.

Mi solución no se limita a una actualización visual; es una evolución funcional diseñada para que la herramienta se adapte al entorno físico del consultorio.

🛠 Evolución del Prototipo: Paso a Paso
1. Sistema de Acceso y Localización Global
Para profesionalizar el primer contacto con la app, implementé un flujo de Login que prioriza la accesibilidad internacional:

Selector de Idioma Dinámico: Agregué una barra de idioma directamente en el Login. Esto permite que el sistema adapte todo el contexto médico de forma inmediata, evitando errores de interpretación en términos técnicos.

Selector de País (Banderas): En el registro del celular, implementé una validación visual con banderas. Esto asegura que los datos de contacto del tutor se capturen con el formato internacional correcto desde el inicio.

2. Rediseño de la "Analyze Page" (Creación de Reportes)
Transformé la página de análisis en un centro de control dinámico que reduce drásticamente el tiempo de reporte:

Funcionalidad de Dictado (Web Speech API): Implementé un sistema de reconocimiento de voz para el campo de observaciones. El veterinario puede narrar sus hallazgos en tiempo real mientras mantiene sus manos sobre el paciente, eliminando la barrera del teclado.

Gestión de Evidencias con Vista Dual: Diseñé un layout dividido donde el formulario y la carga de imágenes conviven. Esto permite al médico previsualizar las ecografías o radiografías mientras redacta el diagnóstico, asegurando que ningún detalle visual sea omitido.


Carga Inteligente de Imágenes: Implementé un sistema de Drag-and-Drop con feedback visual instantáneo, permitiendo una organización fluida de la evidencia clínica.

3. Validación y Robustez del Proceso

Cierre de Reporte Inteligente: El botón de "Finalizar" solo se habilita tras cumplir con una validación lógica: datos críticos del paciente (nombre, especie, estudio) y la presencia obligatoria de evidencias fotográficas.


Identidad Profesional: Integré de forma dinámica los perfiles del usuario y de la clínica en el flujo del reporte, reforzando la trazabilidad del diagnóstico.

🏗 Stack Tecnológico Seleccionado
Elegí estas herramientas para garantizar un producto de nivel industrial en el plazo de 72 horas:


React + TypeScript: Crucial para manejar datos médicos complejos con seguridad y evitar errores de flujo.


Tailwind CSS: Utilizado para lograr un pulido estético superior y animaciones suaves que mejoran la experiencia de uso sin distraer.


Vite: Por su velocidad de compilación y optimización de activos para la versión final.


Netlify: Para garantizar un despliegue de producción estable y accesible para los evaluadores.

📽 Entregables
Tal como se solicita en la guía del challenge:


Documentación "The Why": Incluida en este README como análisis estratégico.


Live Demo: Despliegue funcional en Netlify.


Video de Defensa (Enviado por email): Un recorrido de 5 minutos explicando estas decisiones técnicas y de diseño.

Candidato: Yamila Horn


LinkedIn: https://www.linkedin.com/in/yamila-horn-733542269


Desafío: UI Engineer Challenge