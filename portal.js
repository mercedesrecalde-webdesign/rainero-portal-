var supabase = null;
var devClicks = 0;
var clickTimer = null;

try {
  if (window.supabase) {
    supabase = window.supabase.createClient(
      'https://dukgjrhyhyxvdqzhthje.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1a2dqcmh5aHl4dmRxemh0aGplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MTQzNjIsImV4cCI6MjA4MzQ5MDM2Mn0.JYZWv2vYwMbTopyL-T8_kjbX2py5IL7Ap6ASZc2B4dM'
    );
  }
} catch (e) { }

function handleMvlClick() {
  devClicks++;
  clearTimeout(clickTimer);
  if (devClicks >= 3) {
    devClicks = 0;
    openDevModal();
  } else {
    clickTimer = setTimeout(function () { devClicks = 0; }, 1000);
  }
}

function openDevModal() {
  document.getElementById('dev-modal').classList.add('show');
}

function closeDevModal() {
  document.getElementById('dev-modal').classList.remove('show');
  document.getElementById('dev-email').value = '';
  document.getElementById('dev-pass').value = '';
}

function loginDev() {
  var email = document.getElementById('dev-email').value.trim();
  var pass = document.getElementById('dev-pass').value;
  if ((email === 'mercedes@sistemarecalde.com' || email === 'mercedes.recalde@mvl.edu.ar') && pass === 'dev2025') {
    closeDevModal();
    document.getElementById('dev-panel').classList.add('show');
    showToast('🚀 Bienvenida!');
    loadInscripcionFromDB();
  } else {
    showToast('❌ Credenciales incorrectas');
  }
}

function closeDevPanel() {
  document.getElementById('dev-panel').classList.remove('show');
}

function showToast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function () { t.classList.remove('show'); }, 3000);
}

function toggleInscripcion() {
  var cb = document.getElementById('inscripcion-activa');
  var st = document.getElementById('inscripcion-status');
  if (cb.checked) {
    st.className = 'dev-inscripcion-status open';
    st.textContent = '✓ Inscripciones Abiertas';
  } else {
    st.className = 'dev-inscripcion-status closed';
    st.textContent = '✗ Inscripciones Cerradas';
  }
}

function saveInscripcion() {
  var isActive = document.getElementById('inscripcion-activa').checked;
  var title = document.getElementById('inscripcion-titulo').value;

  // 1. Simulación Local (LocalStorage para Kids App)
  if (isActive) {
    localStorage.setItem('rainero_active_season', 'summer');
    showToast('🚀 ¡Lanzado! (Visible en Kids)');
  } else {
    localStorage.removeItem('rainero_active_season');
    showToast('⏸️ Inscripciones Pausadas');
  }

  // 2. Intento de Guardado en DB (Si existe conexión)
  if (supabase) {
    var data = {
      activa: isActive,
      titulo: title,
      periodo: document.getElementById('inscripcion-periodo').value,
      horario: document.getElementById('inscripcion-horario').value,
      clases: document.getElementById('inscripcion-clases').value,
      dia: document.getElementById('inscripcion-dia').value,
      recetas: document.getElementById('inscripcion-recetas').value,
      updated_at: new Date().toISOString()
    };
    supabase.from('inscripciones_config').update(data).eq('programa', 'kids')
      .then(function (res) {
        if (res.error) console.log('DB Error (ignorado en local):', res.error);
      });
  }
}

function loadInscripcionFromDB() {
  if (!supabase) return;
  supabase.from('inscripciones_config').select('*').eq('programa', 'kids').single()
    .then(function (res) {
      if (res.data) {
        document.getElementById('inscripcion-activa').checked = res.data.activa;
        document.getElementById('inscripcion-titulo').value = res.data.titulo || '';
        document.getElementById('inscripcion-periodo').value = res.data.periodo || '';
        document.getElementById('inscripcion-horario').value = res.data.horario || '';
        document.getElementById('inscripcion-clases').value = res.data.clases || '';
        document.getElementById('inscripcion-dia').value = res.data.dia || '';
        document.getElementById('inscripcion-recetas').value = res.data.recetas || '';
        toggleInscripcion();
      }
    });
}

// Reports Logic
function showReports() {
  document.getElementById('reports-modal').classList.add('show');
}
function closeReports() {
  document.getElementById('reports-modal').classList.remove('show');
}
