/**
 * LABORALEC PRO - VERSIÓN 5.1 (UX MEJORADA)
 * Ajuste: Jubilación basada en Sueldo Mensual
 */

const SBU = 482.00;
const $ = id => document.getElementById(id);
const val = id => parseFloat($(id)?.value) || 0;
const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
const html = (id, h) => { const e = $(id); if(e){ e.innerHTML = h; e.style.display = 'block'; }};

// COEFICIENTES ART. 218 CÓDIGO TRABAJO
const COEFICIENTES = {
    40: 31.97, 41: 31.25, 42: 30.52, 43: 29.77, 44: 29.00,
    45: 28.22, 46: 27.42, 47: 26.61, 48: 25.78, 49: 24.94,
    50: 24.08, 51: 23.21, 52: 22.33, 53: 21.43, 54: 20.52,
    55: 19.61, 56: 18.68, 57: 17.75, 58: 16.81, 59: 15.87,
    60: 14.93, 61: 13.98, 62: 13.04, 63: 12.11, 64: 11.19,
    65: 10.28, 66: 9.39,  67: 8.52,  68: 7.68,  69: 6.88,
    70: 6.12,  71: 5.40,  72: 4.73,  73: 4.12,  74: 3.56,
    75: 3.07,  76: 2.64,  77: 2.26,  78: 1.94,  79: 1.66,
    80: 1.43,  81: 1.23,  82: 1.07,  83: 0.93,  84: 0.81, 85: 0.71
};

const app = {
    navigate: tab => {
        document.querySelectorAll('.tab-pane, .tab-btn').forEach(e => e.classList.remove('active'));
        $(tab)?.classList.add('active'); event.currentTarget.classList.add('active');
    }
};

const calc = {
    iess: () => {
        const s = val('iess_sueldo'), t = $('iess_tipo').value, fr = $('iess_fr').checked;
        const [p, pt] = t === 'privado' ? [0.0945, 0.1215] : t === 'publico' ? [0.1145, 0.0915] : [0.1760, 0];
        const vP = s * p, vPt = s * pt, vFr = fr ? s * 0.0833 : 0;
        html('res_iess', `Per: <b>${fmt(vP)}</b> | Pat: <b>${fmt(vPt)}</b> ${fr ? `| FR: <b>${fmt(vFr)}</b>` : ''}<br>Total: <b>${fmt(vP + vPt + vFr)}</b>`);
    },
    liquidacion: () => {
        const s = val('liq_sueldo'), a = val('liq_anios'), c = $('liq_causa').value;
        const desahucio = c !== 'acuerdo' ? (s * 0.25) * a : 0;
        const despido = c === 'intempestivo' ? (a < 3 ? s * 3 : s * (a > 25 ? 25 : a)) : 0;
        html('res_liq', `Desahucio: ${fmt(desahucio)} <br> Despido: ${fmt(despido)} <br><b>Total: ${fmt(desahucio + despido)}</b>`);
    },
    extras: () => {
        const vH = val('he_sueldo') / 240, h50 = val('he_50'), h100 = val('he_100');
        html('res_he', `50%: ${fmt(h50 * vH * 1.5)} | 100%: ${fmt(h100 * vH * 2)} <br><b>Total: ${fmt((h50 * vH * 1.5) + (h100 * vH * 2))}</b>`);
    },
    decimos: () => {
        const sueldo = val('dec_sueldo'); 
        const meses = val('dec_meses');
        const d3 = (sueldo * meses) / 12;
        const d4 = (SBU * meses) / 12; 
        html('res_dec', `
            <div style="display:flex; justify-content:space-between;"><span>13ro (Sueldo):</span> <b>${fmt(d3)}</b></div>
            <div style="display:flex; justify-content:space-between;"><span>14to (Bono):</span> <b>${fmt(d4)}</b></div>
            <div style="margin-top:5px; border-top:1px solid #ccc; padding-top:5px; text-align:right;">
                Total a recibir: <b style="color:#2563eb; font-size:1.1rem">${fmt(d3 + d4)}</b>
            </div>
        `);
    },
    jubilacion: () => {
        const sueldoMensual = val('jub_prom'); // Leemos el mensual
        const promedioAnual = sueldoMensual * 12; // LO ANUALIZAMOS AUTOMÁTICAMENTE
        const a = val('jub_anios'); 
        const edad = parseInt($('jub_edad').value) || 60;
        
        if (a < 20 && a < 25) return html('res_jub', '<b style="color:red">Mínimo 20 años requeridos.</b>');
        
        let coef = COEFICIENTES[edad];
        if (!coef) coef = edad < 40 ? 31.97 : 0.71; 

        // Fórmula: (Promedio Anual * 5% * Años) / Coeficiente
        const haber = (promedioAnual * 0.05) * a;
        let anual = haber / coef;
        let mensualReal = anual / 12; 

        let mensualFinal = mensualReal;
        let nota = "";
        
        if (mensualReal < 30) { mensualFinal = 30; nota = "⚠️ Sube a Mínimo Legal"; } 
        else if (mensualReal > SBU) { mensualFinal = SBU; nota = "⚠️ Tope Máximo SBU"; }

        html('res_jub', `
            <div style="font-size:0.85rem; color:#555; background:#f8fafc; padding:8px; border-radius:4px;">
                1. Promedio Anual Estimado: <b>${fmt(promedioAnual)}</b><br>
                2. Haber (${fmt(promedioAnual)} x 5% x ${a} años): <b>${fmt(haber)}</b><br>
                3. Coeficiente (Edad ${edad}): <b>${coef}</b><br>
            </div>
            <div style="margin-top:10px; text-align:center;">
                Pensión Mensual a Pagar:<br>
                <b style="color:green; font-size:1.4rem">${fmt(mensualFinal)}</b><br>
                <small style="color:#d97706; font-weight:bold;">${nota}</small>
            </div>
        `);
    },
    losep: () => html('res_losep', `Indemnización: <b>${fmt(Math.min((SBU * 5) * val('losep_anios'), SBU * 150))}</b>`)
};

const legal = {
    data: [
        {id:1, c:'MDT-2026-001', t:'SBU 2026', d:'Salario Básico $482.00'},
        {id:2, c:'MDT-2026-044', t:'Jornada Híbrida', d:'Regulaciones teletrabajo'},
        {id:3, c:'MDT-2026-012', t:'Seguridad Salud', d:'Reglamento vigente'},
        {id:4, c:'MDT-2025-220', t:'Contrato Joven', d:'Incentivos fiscales'}
    ],
    init: () => { const l = $('agreementList'); if(l) l.innerHTML = legal.data.map(i => `<div class="doc-item" onclick="legal.view(${i.id})"><b>${i.c}</b><br>${i.t}</div>`).join(''); },
    view: id => {
        const i = legal.data.find(d => d.id === id);
        html('agreementViewer', `<div class="pdf-content-sim"><h2>${i.c}</h2><h3>${i.t}</h3><p>${i.d}</p><button class="btn btn-primary" onclick="alert('Descargando PDF...')">Descargar</button></div>`);
    },
    search: () => {
        const q = $('legalSearch').value.toLowerCase();
        $('agreementList').innerHTML = legal.data.filter(i => i.t.toLowerCase().includes(q) || i.c.toLowerCase().includes(q)).map(i => `<div class="doc-item" onclick="legal.view(${i.id})"><b>${i.c}</b><br>${i.t}</div>`).join('');
    }
};

const cv = {
    update: () => ['nombre','titulo','contacto','perfil','exp','edu'].forEach(f => { const i=$( `cv_${f}`), p=$(`p_${f}`); if(i&&p) p.innerText=i.value; }),
    save: () => alert("CV Guardado temporalmente.")
};

const bot = {
    toggle: () => { const w = $('chatWindow'); w.style.display = w.style.display === 'flex' ? 'none' : 'flex'; },
    send: () => {
        const i = $('chatInput'), l = $('chatLog'), txt = i.value.trim().toLowerCase();
        if(!txt) return;
        l.innerHTML += `<div class="msg user">${i.value}</div>`; i.value = '';
        setTimeout(() => {
            let r = "No entiendo. Prueba: 'vacaciones', 'despido', 'iess'.";
            if(txt.includes('vacaciones')) r = "15 días anuales (Art. 69).";
            else if(txt.includes('despido')) r = "Indemnización: 1 sueldo por año (Art. 188).";
            else if(txt.includes('iess')) r = "Aporte personal: 9.45%.";
            l.innerHTML += `<div class="msg bot">${r}</div>`; l.scrollTop = l.scrollHeight;
        }, 500);
    }
};

window.onload = () => { 
    legal.init(); 
    if(window.innerWidth <= 768) setTimeout(() => $('mobile-legal-footer').style.display = 'none', 3000); 
    window.app = app; window.calculators = calc; window.agreements = legal; window.cv = cv; window.chatbot = bot;
};
