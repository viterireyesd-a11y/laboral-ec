// js/calculos.js

function calcularJubilacionPatronal() {
    // 1. Capturar los datos de los inputs
    const promedioSueldo = parseFloat(document.getElementById('promedio').value);
    const añosServicio = parseInt(document.getElementById('añosServicio').value);
    const edad = parseInt(document.getElementById('edad').value);

    // 2. SEGURIDAD: Validar que sean números y no estén vacíos
    if (isNaN(promedioSueldo) || isNaN(añosServicio) || isNaN(edad)) {
        alert("⚠️ Seguridad: No se pueden procesar letras o campos vacíos.");
        return; // Aquí se detiene el proceso
    }

    // 3. Lógica según el Código del Trabajo (Art. 216)
    // Nota: El cálculo real es complejo (coeficientes por edad), 
    // pero aquí pondremos una base para probar que funciona.
    if (añosServicio < 25) {
        alert("La jubilación patronal aplica a partir de los 25 años de servicio.");
        return;
    }

    // Cálculo de ejemplo (Base)
    const resultado = (promedioSueldo * 0.25) * (añosServicio / 25);

    // 4. Mostrar el resultado en la página
    document.getElementById('resultadoPersion').innerText = `Pensión estimada: $${resultado.toFixed(2)}`;
}
