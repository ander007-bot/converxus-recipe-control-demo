# Converxus Recipe Control

**Control, dosificación y trazabilidad de preparación por recetas**

Plataforma web industrial de Converxus para procesos de preparación,
dosificación y llenado de tanques mediante recetas configurables: fuente de
líquido tratado → tanque pulmón → manifold de distribución → válvulas
automáticas → tanques de preparación.

## Funcionalidades

- **Vista general** — Mímico industrial tipo SCADA con animación de flujo, estados de válvulas y tanques, receta activa, litros programados vs reales y KPIs de planta.
- **Control de recetas** — Recetas configuradas, creación de órdenes de preparación con tanque destino, litros, operador y lote; iniciar, pausar, cancelar y finalizar.
- **Tanques** — Tarjetas con nivel visual, volumen, receta activa, lote, válvula y sensor asociados.
- **Detalle de tanque** — Caudal instantáneo, tiempos, estado de válvulas y agitador, y gráficas de litros acumulados, caudal y nivel vs tiempo.
- **Alarmas** — Gestión de alarmas industriales con prioridad, estado y reconocimiento por usuario.
- **Históricos** — Trazabilidad por lote, tanque, receta y operador con filtros y exportación.
- **Reportes** — KPIs ejecutivos y gráficas gerenciales (consumo, preparaciones, uso por tanque, alarmas, precisión de dosificación).
- **Configuración** — Tanques, recetas, sensores, válvulas, operadores, límites de alarma e integración PLC/HMI/Cloud.

La interfaz se actualiza cada 2 segundos con los valores de proceso: caudales,
niveles, avances de llenado y alarmas.

## Tecnologías

- [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [React Router 6](https://reactrouter.com/)
- [Recharts](https://recharts.org/) (gráficas)
- [Lucide](https://lucide.dev/) (iconografía)

Aplicación 100 % frontend: no requiere backend, base de datos ni variables de
entorno para su despliegue.

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

## Credenciales de acceso

| Campo      | Valor                     |
| ---------- | ------------------------- |
| Correo     | `comercial@converxus.com` |
| Contraseña | `Converxus2026*`          |

La sesión se conserva al recargar la página y todas las rutas internas están
protegidas: sin sesión activa, la plataforma redirige al inicio de sesión.

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
