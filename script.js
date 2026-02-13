} else if(textLower.includes('despido')) {
                response = "El <strong>Despido Intempestivo (Art. 188)</strong> se indemniza así:<br>• Hasta 3 años: 3 meses de sueldo.<br>• Más de 3 años: 1 mes de sueldo por cada año de servicio (tope 25 años).";
            } else if(textLower.includes('renuncia')) {
                response = "En caso de renuncia, aplica el <strong>Desahucio (Art. 184)</strong>: 25% de la última remuneración por cada año de servicio completo.";
            } else if(textLower.includes('iess')) {
                response = "Las tasas vigentes son:<br>• Privado: 9.45% (Personal) + 12.15% (Patronal).<br>• Público: 11.45% (Personal) + 9.15% (Patronal).";
            }

            const botMsgDiv = document.createElement('div');
            botMsgDiv.className = 'msg bot';
            botMsgDiv.innerHTML = response;
            log.appendChild(botMsgDiv);
            
            log.scrollTop = log.scrollHeight;
        }, 600);
    }
};

// --- INICIALIZACIÓN (SCRIPT PARA OCULTAR FOOTER EN MOVIL) ---
window.onload = () => {
    if (typeof agreements !== 'undefined') agreements.init();
    
    // Detectar móvil (ancho <= 768px)
    if (window.innerWidth <= 768) {
        setTimeout(() => {
            const footer = document.getElementById('mobile-legal-footer');
            if(footer) {
                footer.style.opacity = '0'; // Desvanecer
                footer.style.transform = 'translateY(100%)'; // Deslizar abajo
                setTimeout(() => { footer.style.display = 'none'; }, 500);
            }
        }, 3000); // 3000ms = 3 Segundos exactos
    }
};
