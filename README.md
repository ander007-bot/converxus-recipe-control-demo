# Converxus Recipe Control — Demo comercial

**Control, dosificación y trazabilidad de preparación por recetas**

Aplicación web demo de la plataforma industrial Converxus para procesos de
preparación, dosificación y llenado de tanques mediante recetas configurables:
fuente de líquido tratado → tanque pulmón → manifold de distribución → válvulas
automáticas → tanques de preparación.

> **Aclaración:** Esta aplicación es una vista previa comercial con datos
> simulados. No está conectada a PLC, HMI ni base de datos real.

## Funcionalidades

- **Vista general** — Mímico industrial tipo SCADA con animación de flujo, estados de válvulas y tanques, receta activa, litros programados vs reales y KPIs de planta.
- **Control de recetas** — 6 recetas configuradas, creación de órdenes de preparación con tanque destino, litros, operador y lote; iniciar, pausar, cancelar y finalizar.
- **Tanques** — Tarjetas con nivel visual, volumen, receta activa, lote, válvula y sensor asociados.
- **Detalle de tanque** — Caudal instantáneo, tiempos, estado de válvulas y agitador, y gráficas de litros acumulados, caudal y nivel vs tiempo.
- **Alarmas** — Tabla de alarmas industriales con prioridad, estado y reconocimiento por usuario.
- **Históricos** — Trazabilidad por lote, tanque, receta y operador con filtros y exportación demo.
- **Reportes** — KPIs ejecutivos y gráficas gerenciales (consumo, preparaciones, uso por tanque, alarmas, precisión de dosificación).
- **Configuración** — Tanques, recetas, sensores, válvulas, operadores, límites de alarma e integración PLC/HMI/Cloud.

Los datos se simulan localmente y se actualizan cada 2 segundos para que la
demo se sienta viva: caudales, niveles, avances de llenado y alarmas.

## Tecnologías

- [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [React Router 6](https://reactrouter.com/)
- [Recharts](https://recharts.org/) (gráficas)
- [Lucide](https://lucide.dev/) (iconografía)

Sin backend, sin base de datos y sin variables de entorno: todo es frontend con
datos simulados.

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abrir http://localhost:5173

Para generar el build de producción:

```bash
npm run build
npm run preview
```

## Credenciales demo

| Campo      | Valor                     |
| ---------- | ------------------------- |
| Correo     | `comercial@converxus.demo` |
| Contraseña | `Converxus2026*`          |

El login es simulado (localStorage). La sesión se conserva al recargar la
página y todas las rutas internas están protegidas.

## Desplegar en Vercel

1. Suba este repositorio a GitHub (ya incluye `vercel.json` para el ruteo SPA).
2. En [vercel.com](https://vercel.com), seleccione **Add New → Project** e importe el repositorio `converxus-recipe-control-demo`.
3. Vercel detecta automáticamente el framework **Vite**:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Presione **Deploy**. No se requieren variables de entorno.

También puede desplegarse desde la terminal:

```bash
npm i -g vercel
vercel --prod
```

---

**Powered by Converxus** · Converxus Industrial Platform
Vista previa comercial — Datos simulados para presentación técnica
