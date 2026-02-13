/**
 * LABORALEC PRO 2026 - Master Logic
 * Ingeniero Alask
 */

const CONFIG = {
    SBU: 482.00,
    ANIOS_JUBILACION: 20
};

const utils = {
    formatUSD: (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num),
    getVal: (id) => parseFloat(document.getElementById(id).value) || 0,
    setHTML: (id, html) => { 
        const el = document.getElementById(id); 
        el.innerHTML = html; 
        el.style.display = 'block'; 
    }
};

const app = {
    navigate: (tabId) => {
        document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
        event.currentTarget.classList.add('active');
    }
};

const calculators = {
    iess: () => {
        const sueldo = utils.getVal('iess_sueldo');
        const tipo = document.getElementById('iess_tipo').value;
        const fr = document.getElementById('iess_fr').checked;
        let per = 0, pat = 0;
        if(tipo === 'privado') { per = 0.0945; pat = 0.1215; }
        else if(tipo === 'publico') { per = 0.1145; pat = 0.0915; }
        else { per = 0.1760; pat = 0; }
        const vPer = sueldo * per;
        const vPat = sueldo * pat;
        const vFr = fr ? sueldo * 0.0833 : 0;
        utils.setHTML('res_iess', `
            <div class="res-row"><span>Aporte Personal (${(per*100).toFixed(2)}%):</span> <strong>${utils.formatUSD(vPer)}</strong></div>
            <div class="res-row"><span>Aporte Patronal (${(pat*100).toFixed(2)}%):</span> <strong>${utils.formatUSD(vPat)}</strong></div>
            ${fr ? `<div class="res-row"><span>Fondo Reserva (8.33%):</span> <strong>${utils.formatUSD(vFr)}</strong></div>` : ''}
            <div class="res-total"><span>Total IESS:</span> <span>${utils.formatUSD(vPer + vPat + vFr)}</span></div>
        `);
    },
    liquidacion: () => {
        const s = utils.getVal('liq_sueldo');
        const a = utils.getVal('liq_anios');
        const c = document.getElementById('liq_causa').value;
        let desahucio = (s * 0.25) * a;
        let despido = (c === 'intempestivo') ? (a < 3 ? s * 3 : s * (a > 25 ? 25 : a)) : 0;
        utils.setHTML('res_liq', `
            <div class="res-row"><span>Bonif. Desahucio:</span> <span>${utils.formatUSD(desahucio)}</span></div>
            <div class="res-row"><span>Indem. Despido:</span> <span>${utils.formatUSD(despido)}</span></div>
            <div class="res-total"><span>Total Liquidación:</span> <span>${utils.formatUSD(desahucio + despido)}</span></div>
        `);
    }
    // ... [Aquí siguen las demás funciones: extras, decimos, jubilacion, losep]
};

// --- Inicialización del Sistema ---
window.onload = () => {
    if (typeof agreements !== 'undefined') agreements.init();
    
    // Auto-ocultar footer en móvil (3 segundos)
    if (window.innerWidth <= 768) {
        setTimeout(() => {
            const footer = document.getElementById('mobile-legal-footer');
            if(footer) {
                footer.style.opacity = '0';
                footer.style.transform = 'translateY(100%)';
                setTimeout(() => { footer.style.display = 'none'; }, 500);
            }
        }, 3000);
    }
};
