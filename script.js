// --- CONFIGURACIÓN GLOBAL ---
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

// --- NAVEGACIÓN ---
const app = {
    navigate: (tabId) => {
        document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
        event.currentTarget.classList.add('active');
    }
};

// --- CALCULADORAS ---
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
        
        let desahucio = 0, despido = 0;
        // Desahucio (Art 184): 25% por año
        if(c !== 'acuerdo') desahucio = (s * 0.25) * a;

        // Despido (Art 188)
        if(c === 'intempestivo') {
            despido = (a < 3) ? (s * 3) : (s * (a > 25 ? 25 : a));
        }

        utils.setHTML('res_liq', `
            <div class="res-row"><span>Bonif. Desahucio:</span> <span>${utils.formatUSD(desahucio)}</span></div>
            <div class="res-row"><span>Indem. Despido:</span> <span>${utils.formatUSD(despido)}</span></div>
            <div class="res-total"><span>Total Liquidación:</span> <span>${utils.formatUSD(desahucio + despido)}</span></div>
            <small style="display:block; margin-top:10px; color:#64748b;">* Cálculo base. No incluye vacaciones no gozadas ni décimos proporcionales.</small>
        `);
    },
    extras: () => {
        const s = utils.getVal('he_sueldo');
        const h50 = utils.getVal('he_50');
        const h100 = utils.getVal('he_100');
        const vHora = s / 240;
        
        utils.setHTML('res_he', `
            <div class="res-row"><span>Valor Hora Normal:</span> <span>${utils.formatUSD(vHora)}</span></div>
            <div class="res-row"><span>Pago Horas 50%:</span> <span>${utils.formatUSD(h50 * vHora * 1.5)}</span></div>
            <div class="res-row"><span>Pago Horas 100%:</span> <span>${utils.formatUSD(h100 * vHora * 2)}</span></div>
            <div class="res-total"><span>Total Extras:</span> <span>${utils.formatUSD((h50*vHora*1.5)+(h100*vHora*2))}</span></div>
        `);
    },
    decimos: () => {
        const i = utils.getVal('dec_ingresos');
        const m = utils.getVal('dec_meses');
        utils.setHTML('res_dec', `
            <div class="res-row"><span>13er Sueldo:</span> <span>${utils.formatUSD(i/12)}</span></div>
            <div class="res-row"><span>14to Sueldo:</span> <span>${utils.formatUSD((CONFIG.SBU/12)*m)}</span></div>
            <div class="res-total"><span>Total Provisión:</span> <span>${utils.formatUSD((i/12)+((CONFIG.SBU/12)*m))}</span></div>
        `);
    },
    jubilacion: () => {
        const p = utils.getVal('jub_prom');
        const a = utils.getVal('jub_anios');
        
        if(a < 20) return utils.setHTML('res_jub', '<span style="color:var(--color-danger); font-weight:bold;">Error: Se requiere un mínimo de 20 años de servicio continuo o discontinuo (según causal).</span>');
        
        const fondo = (p * a) * 0.05; // Coeficiente simplificado
        utils.setHTML('res_jub', `
            <div class="res-row"><span>Fondo Global Est.:</span> <span>${utils.formatUSD(fondo)}</span></div>
            <div class="res-row"><span>Pensión Mensual Ref.:</span> <span>${utils.formatUSD(fondo/120)}</span></div>
            <div class="res-total"><span>Total Fondo:</span> <span>${utils.formatUSD(fondo)}</span></div>
        `);
    },
    losep: () => {
        const rmu = utils.getVal('losep_rmu');
        const a = utils.getVal('losep_anios');
        let total = (CONFIG.SBU * 5) * a;
        const tope = CONFIG.SBU * 150;
        if(total > tope) total = tope;
        utils.setHTML('res_losep', `<div class="res-total"><span>Indemnización LOSEP:</span> <span>${utils.formatUSD(total)}</span></div>`);
    }
};

// --- ACUERDOS MINISTERIALES (DB y Lógica) ---
const agreements = {
    data: [
        { id: 1, code: 'MDT-2026-001', title: 'Fijación del SBU 2026', tags: 'Salarios', content: 'Fíjese el Salario Básico Unificado del trabajador en general, incluidos los trabajadores de la pequeña industria, trabajadores agrícolas y de maquila; trabajadores del servicio doméstico, operarios de artesanías y colaboradores de la microempresa, en la cantidad de CUATROCIENTOS OCHENTA Y DOS DÓLARES DE LOS ESTADOS UNIDOS DE AMÉRICA ($482,00) mensuales.' },
        { id: 2, code: 'MDT-2026-044', title: 'Directrices Jornada Híbrida', tags: 'Teletrabajo', content: 'EXPEDIR LAS DIRECTRICES PARA LA APLICACIÓN DE LA JORNADA HÍBRIDA. Art 1.- Objeto: Regular el registro, control y pago de horas suplementarias en modalidad de teletrabajo. Art 2.- Derecho a desconexión: El empleador debe garantizar 12 horas continuas de desconexión.' },
        { id: 3, code: 'MDT-2026-012', title: 'Reglamento Seguridad Salud', tags: 'Seguridad', content: 'Reformas al Reglamento de Seguridad y Salud de los Trabajadores. Obligatoriedad de registro de Comité Paritario en plataforma SUT en un plazo no mayor a 30 días.' },
        { id: 4, code: 'MDT-2025-220', title: 'Contrato Joven y Empleo', tags: 'Contratos', content: 'Incentivos fiscales para la contratación de jóvenes entre 18 y 29 años. Deducción adicional del 100% en el Impuesto a la Renta sobre remuneraciones y aportes al IESS.' }
    ],
    init: () => {
        const list = document.getElementById('agreementList');
        if(list) {
            list.innerHTML = agreements.data.map(item => `
                <div class="doc-item" onclick="agreements.view(${item.id})">
                    <div class="doc-code">${item.code}</div>
                    <div class="doc-title">${item.title}</div>
                    <span class="doc-tag">${item.tags}</span>
                </div>
            `).join('');
        }
    },
    search: () => {
        const q = document.getElementById('legalSearch').value.toLowerCase();
        const filtered = agreements.data.filter(item => 
            item.title.toLowerCase().includes(q) || item.code.toLowerCase().includes(q) || item.tags.toLowerCase().includes(q)
        );
        const list = document.getElementById('agreementList');
        list.innerHTML = filtered.map(item => `
            <div class="doc-item" onclick="agreements.view(${item.id})">
                <div class="doc-code">${item.code}</div>
                <div class="doc-title">${item.title}</div>
                <span class="doc-tag">${item.tags}</span>
            </div>
        `).join('');
    },
    view: (id) => {
        const item = agreements.data.find(d => d.id === id);
        document.getElementById('agreementViewer').innerHTML = `
            <div class="pdf-content-sim">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:2px solid var(--color-primary); padding-bottom:10px;">
                    <h2 style="color:var(--color-primary); margin:0;">${item.code}</h2>
                    <span style="background:var(--color-accent); color:white; padding:4px 10px; border-radius:4px; font-size:0.8rem;">VIGENTE</span>
                </div>
                <h3 style="color:#444; margin-bottom:20px;">${item.title}</h3>
                <div style="background:#f8f9fa; padding:20px; border-left:4px solid var(--color-primary); font-family:'Georgia', serif; line-height:1.6; color:#333;">
                    ${item.content}
                </div>
                <div style="margin-top:30px; text-align:right;">
                    <button class="btn btn-primary" style="width:auto;" onclick="downloader.simulate('${item.code}')">
                        <i class="fas fa-file-pdf"></i> Descargar Original Firmado
                    </button>
                </div>
            </div>
        `;
    }
};

// --- SIMULADOR DE DESCARGA PRO ---
const downloader = {
    simulate: (filename) => {
        const modal = document.getElementById('downloadModal');
        const bar = document.getElementById('dlProgress');
        const text = document.getElementById('dlText');
        const status = document.getElementById('dlStatus');
        
        modal.style.display = 'flex';
        bar.style.width = '0%';
        text.innerText = `Solicitando archivo: ${filename}.pdf...`;
        status.innerText = 'Iniciando conexión segura...';
        status.style.color = '#333';

        // Secuencia de simulación
        setTimeout(() => { bar.style.width = '30%'; status.innerText = 'Conectando con repositorio MDT...'; }, 500);
        setTimeout(() => { bar.style.width = '70%'; status.innerText = 'Descargando paquetes de datos...'; }, 1500);
        setTimeout(() => { 
            bar.style.width = '100%'; 
            status.innerText = '¡Descarga Completa!'; 
            status.style.color = 'var(--color-success)';
            text.innerText = 'El archivo se ha guardado en su carpeta de descargas.';
        }, 2500);
        
        setTimeout(() => { modal.style.display = 'none'; }, 4000);
    }
};

// --- HOJA DE VIDA ---
const cv = {
    update: () => {
        const fields = ['nombre', 'titulo', 'contacto', 'perfil', 'exp', 'edu'];
        fields.forEach(f => {
            const val = document.getElementById(`cv_${f}`).value;
            if(val) document.getElementById(`p_${f}`).innerText = val;
        });
    },
    save: () => {
        alert("Datos guardados en caché del navegador.");
    }
};

// --- CHATBOT INTELIGENTE ---
const chatbot = {
    toggle: () => {
        const win = document.getElementById('chatWindow');
        win.style.display = (win.style.display === 'flex') ? 'none' : 'flex';
    },
    checkEnter: (e) => { if(e.key === 'Enter') chatbot.send(); },
    send: () => {
        const input = document.getElementById('chatInput');
        const text = input.value.trim();
        if(!text) return;

        const log = document.getElementById('chatLog');
        
        const userMsgDiv = document.createElement('div');
        userMsgDiv.className = 'msg user';
        userMsgDiv.innerText = text;
        log.appendChild(userMsgDiv);
        
        const textLower = text.toLowerCase();
        input.value = '';
        log.scrollTop = log.scrollHeight;

        // Lógica de Respuesta
        setTimeout(() => {
