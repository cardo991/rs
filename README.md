# RS Autopartes · Glass Edition
Sitio estático responsive, sin dependencias de producción. HTML, CSS y JavaScript modular.

## Ejecutar
Requiere Node.js 18 o superior.
- npm run dev
- Abrir http://127.0.0.1:4174
- npm test

Se debe servir por HTTP: los módulos JavaScript no funcionan de forma fiable abriendo index.html por file://.

## Pedido por WhatsApp
- Selección por SKU, cantidades de 1 a 999, eliminación individual y vaciado.
- Persistencia en localStorage con la clave rs-pedido-v1 y sincronización entre pestañas.
- Nombre/empresa y nota opcionales guardados en rs-contacto-v1.
- El botón abre wa.me con el pedido codificado. El visitante debe confirmar el envío en WhatsApp.
- Número comercial: +54 9 11 2664-7681, tomado del banner oficial publicado en febrero de 2026.
- La lista no se elimina al abrir WhatsApp: no es posible saber si el usuario finalmente envió el mensaje.
- No procesa pagos, no registra ventas y no consulta stock/precios en tiempo real.
- Si el navegador bloquea localStorage, se informa al usuario y se mantiene la lista en memoria.

## Contenido
Catálogo inicial de 10 SKU de muestra reales, no el inventario completo. Datos definidos en catalog.js.
Imágenes de productos, logo, datos comerciales y códigos tomados del sitio original y del catálogo 2026:
- https://rsautopartes.com.ar/
- https://rsautopartes.com.ar/nosotros/
- https://rsautopartes.com.ar/contacto/
- https://rsautopartes.com.ar/catalogo/catalogo_2026.pdf
- https://rsautopartes.com.ar/wp-content/uploads/2026/02/tel_new.png

En la portada original hay enlaces con códigos distintos a los de algunas imágenes. Este rediseño usa los códigos del catálogo 2026 asociados a las imágenes: tapa azul 1474, portabicicletas 1144. Las dos tapas de cadena comparten imagen ilustrativa; confirmar aplicación comercial antes de publicar.
Tipografías Barlow Condensed y DM Sans de Google Fonts, guardadas localmente. No hay solicitudes de fuentes a terceros al navegar.

## Publicación
La raíz contiene index.html y los assets; puede servirse como sitio estático en Vercel, Netlify o cualquier servidor web. En Vercel: preset Other, sin comando de build y directorio de salida ".".
El servidor incluido es para vista previa local, no para producción.
El sitio original y las cuentas del negocio no se modificaron.


## Glass Edition
Vista previa de esta edición: http://127.0.0.1:4174. Podés cambiar el puerto con PORT.
- Tipografía nativa de sistema: San Francisco en macOS/iOS; Segoe UI o sans-serif en otros dispositivos.
- Vidrio translúcido mediante backdrop-filter, saturación, brillos y capas con alternativa opaca en navegadores sin soporte.
- Escultura mecánica conceptual con Three.js 0.186.1, distribuido localmente en vendor/ bajo licencia MIT (THREE-LICENSE.txt).
- Animación con reacción al cursor y pausa manual; respeta prefers-reduced-motion.
- El render se detiene fuera de pantalla y en pestañas ocultas; límite de resolución en celulares.
- Si WebGL no está disponible se conserva una composición estática CSS.
- La escultura es una visualización conceptual, no una reproducción técnica de un SKU.
- CSS principal de esta edición: premium.css. Escena: experience.js.

## GitHub Pages
La demo se publica mediante .github/workflows/pages.yml en cada push a main.
El build usa una lista explícita de archivos públicos y genera dist/: no publica scripts de desarrollo, tests, documentación, capturas ni archivos temporales.
En GitHub, Settings > Pages debe tener GitHub Actions como fuente.
Para comprobar el mismo paquete localmente: npm test y npm run build.
