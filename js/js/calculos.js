// js/calculos.js

function exportPDF(id) {
    document.querySelectorAll('.card').forEach(c => c.classList.remove('printing'));
    document.getElementById(id).classList.add('printing');
    window.print();
}

function calc1() {
    let s = parseFloat(document.getElementById('s1').value) || 0;
    let a = parseInt(document.getElementById('a1').value) || 0;
    let aInd = Math.max(a, 3); if(aInd > 25) aInd = 25;
    let vi = aInd * s; 
    let vd = (s * 0.25) * a;
    document.getElementById('v1_i').innerText = f(vi);
    document.getElementById('v1_d').innerText = f(vd);
    document.getElementById('v1_t').innerText = f(vi + vd);
    document.getElementById('res1').style.display = 'block';
}

function calc2() {
    let s = parseFloat(document.getElementById('s2').value) || 0;
    let a = parseInt(document.getElementById('a2').value) || 0;
    let e = parseInt(document.getElementById('e2').value) || 0;
    if(a < 20) { alert("Mínimo 20 años para Jubilación Patronal"); return; }
    let haber = (s * 0.05) * a * 12;
    let coef = (e >= 60) ? 8.24 : 10.45;
    let mensual = (haber / coef) / 12;
    if(a >= 25 && mensual < CONFIG.sbu/2) mensual = CONFIG.sbu/2;
    document.getElementById('v2_f').innerText = f(haber);
    document.getElementById('v2_p').innerText = `${f(mensual)} / mes`;
    document.getElementById('res2').style.display = 'block';
}

function calc3() {
    let s = parseFloat(document.getElementById('s3').value) || 0;
    let d = Math.min(parseInt(document.getElementById('d3').value) || 0, 360);
    let d13 = (s / 360) * d;
    let d14 = (CONFIG.sbu / 360) * d;
    let vac = (s / 24) * (d / 30);
    document.getElementById('v3_13').innerText = f(d13);
    document.getElementById('v3_14').innerText = f(d14);
    document.getElementById('v3_v').innerText = f(vac);
    document.getElementById('v3_t').innerText = f(d13 + d14 + vac);
    document.getElementById('res3').style.display = 'block';
}

function calc4() {
    let s = parseFloat(document.getElementById('s4').value) || 0;
    let vh = s / CONFIG.horasMes;
    let r50 = (parseFloat(document.getElementById('h50').value) || 0) * vh * CONFIG.recargo50;
    let r100 = (parseFloat(document.getElementById('h100').value) || 0) * vh * CONFIG.recargo100;
    document.getElementById('v4_50').innerText = f(r50);
    document.getElementById('v4_100').innerText = f(r100);
    document.getElementById('v4_t').innerText = f(r50 + r100);
    document.getElementById('res4').style.display = 'block';
}

function calc5() {
    let s = parseFloat(document.getElementById('s5').value) || 0;
    let a = parseInt(document.getElementById('a5').value) || 0;
    let base = (5 * s) * a;
    let total = Math.min(base, CONFIG.topeLosepSBU * CONFIG.sbu);
    document.getElementById('v5_b').innerText = f(base);
    document.getElementById('v5_t').innerText = f(total);
    document.getElementById('res5').style.display = 'block';
}
