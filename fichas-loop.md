# Fichas del loop · Casa o calle

## 1. De la portada al análisis

- **Qué activa el scroll.** Selecciono el vinilo de YouTube o Spotify y pulso reproducir. El tocadiscos acompaña el desplazamiento hasta la sección de análisis.
- **Dónde decido yo.** Decido que pulsar reproducir sea el momento de pasar de la portada a los datos. También decido que el tocadiscos siga visible durante el recorrido para mantener la relación entre el disco elegido y el análisis.
- **Qué hace el código.** Calcula la posición del análisis, anima el desplazamiento de la página y coloca el tocadiscos en su soporte. Al terminar, lleva el foco a la sección de análisis. Cuando el navegador tiene activada la reducción de movimiento, el salto es directo.
- **Quién verifica y cómo.** Yo hago la comprobación final en Chrome. Cargo cada vinilo por separado, pulso reproducir y compruebo que llego al análisis de la plataforma elegida. Con YouTube deben aparecer las estadísticas musicales. Repito la prueba con movimiento reducido y compruebo que llego a la misma sección.

## 2. Del análisis a la portada

- **Qué activa el scroll.** Desde el análisis, pulso el control para quitar el disco. La página vuelve arriba y el tocadiscos regresa a su posición de portada.
- **Dónde decido yo.** Decido que quitar el disco cierre la consulta y devuelva al visitante al punto de partida, donde puede elegir otra plataforma.
- **Qué hace el código.** Detiene el tocadiscos, lo devuelve a su soporte inicial y desplaza la página hasta arriba. Al acabar, restablece la vista de comparación y lleva el foco al título de la portada.
- **Quién verifica y cómo.** Yo hago la comprobación final en Chrome. Desde el análisis de YouTube, quito el disco y compruebo que vuelvo a la portada, que el análisis vuelve a la vista de comparación y que puedo cargar Spotify. El recorrido queda comprobado cuando puedo repetir el ciclo con el otro disco.

Los dos recorridos están implementados en [script.js](script.js).
