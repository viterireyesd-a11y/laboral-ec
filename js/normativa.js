// js/normativa.js

// Usamos Object.freeze para que NADIE pueda modificar estos valores
// ni desde la consola ni desde otro script malicioso.
const CONFIG = Object.freeze({
    sbu: 482.00,        // SBU Oficial 2026 Ecuador
    recargo50: 1.5,     // 50% recargo
    recargo100: 2.0,    // 100% recargo
    topeLosepSBU: 150,  // Tope jerárquico superior
    horasMes: 240       // Divisor estándar legal
});

// Formateador de moneda (Seguro y robusto)
const f = (n) => {
    // Protección extra: Si n no es número, devuelve $0.00 para no romper la web
    if (typeof n !== 'number' || isNaN(n)) return "$0.00";
    return `$${n.toLocaleString('es-EC', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
};

// Inicializar fecha y visualización
document.addEventListener('DOMContentLoaded', () => {
    // Verificamos existencia de elementos antes de escribir (Evita errores en consola)
    const elDate = document.getElementById('currentDate');
    const elSbu = document.getElementById('sbu-display');
    const elTope = document.getElementById('v5_tope');

    if(elDate) elDate.innerText = new Date().toLocaleDateString('es-EC');
    if(elSbu) elSbu.innerText = f(CONFIG.sbu);
    
    // Cálculo seguro del tope
    if(elTope) {
        // Usamos los valores congelados
        elTope.innerText = f(CONFIG.sbu * CONFIG.topeLosepSBU);
    }
});
