const SBU = 482.00;
const $ = id => document.getElementById(id);
const val = id => parseFloat($(id)?.value) || 0;
const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
const html = (id, h) => { const e = $(id); if(e){ e.innerHTML = h; e.style.display = 'block'; }};

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
        const d3 = val('dec_ingresos') / 12, d4 = (SBU / 12) * val('dec_meses');
        html('res_dec', `13ro: ${fmt(d3)} | 14to: ${fmt(d4)} <br><b>Total: ${fmt(d3 + d4)}</b>`);
    },
    jubilacion: () => {
        const p = val('jub_prom'), a = val('jub_anios');
        if (a < 20) return html('res_jub', '<b style="color:red">Mínimo 20 años requeridos.</b>');
        let men = ((p * 0.05 * a) / 10.6033) / 12; // Coeficiente legal (60 años)
        men = Math.max(30, Math.min(men, SBU)); // Topes legales: Min $30, Max $482
        html('res_jub', `Pensión Mensual Jubilar: <b style="color:green; font-size:1.2rem">${fmt(men)}</b>`);
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
    // Mapeo global para HTML onclicks
    window.app = app; window.calculators = calc; window.agreements = legal; window.cv = cv; window.chatbot = bot;
};
