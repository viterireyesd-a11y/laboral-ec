// js/normativa.js
const CONFIG = {
    sbu: 460.00, // Ajustado a valor real proyectado o actual
    recargo50: 1.5,
    recargo100: 2.0,
    topeLosepSBU: 150,
    horasMes: 240
};

// Formateador de moneda global
const f = (n) => `$${n.toLocaleString('es-EC', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

// Inicializar fecha y visualización
document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('currentDate')) {
        document.getElementById('currentDate').innerText = new Date().toLocaleDateString();
    }
    if(document.getElementById('sbu-display')) {
        document.getElementById('sbu-display').innerText = f(CONFIG.sbu);
    }
    if(document.getElementById('v5_tope')) {
        document.getElementById('v5_tope').innerText = f(CONFIG.sbu * CONFIG.topeLosepSBU);
    }
});
