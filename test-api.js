// Using global fetch (Node 18+)
const BASE = process.env.BASE_URL || 'http://localhost:3000/api';
const AUTH_TOKEN = process.env.AUTH_TOKEN || ''; // set an Authorization Bearer token before running

async function request(path, options = {}){
  const headers = Object.assign({}, options.headers || {});
  const token = process.env.AUTH_TOKEN || AUTH_TOKEN;
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const fetchOptions = { method: options.method || 'GET', headers };
  if (options.body) {
    // If body is already a string assume caller formatted it
    fetchOptions.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
    if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${BASE}${path}`, fetchOptions);
  const text = await res.text();
  let body = null;
  try { body = JSON.parse(text); } catch(e) { body = text; }
  return { status: res.status, body };
}

async function run(){
  console.log('Base URL:', BASE);
  // Registrar usuario temporal y loguear para obtener token
  const now = Date.now();
  const testEmail = `test.user.${now}@example.com`;
  const testPassword = 'testpass123';
  console.log('\n--- Registrar usuario temporal');
  const reg = await request('/users/register', { method: 'POST', body: JSON.stringify({ name: 'Test User', email: testEmail, password: testPassword }) });
  console.log('Register status', reg.status);
  console.log(JSON.stringify(reg.body, null, 2));
  if (reg.status !== 201) {
    console.log('Registro no exitoso, intentar login con credenciales existentes');
  }

  console.log('\n--- Login con usuario temporal');
  const login = await request('/users/login', { method: 'POST', body: JSON.stringify({ email: testEmail, password: testPassword }) });
  console.log('Login status', login.status);
  console.log(JSON.stringify(login.body, null, 2));
  if (login.status !== 200) {
    console.error('No se pudo obtener token, abortando pruebas.');
    return;
  }

  // Establecer token para próximas peticiones
  const token = login.body.data.token;
  if (!token) {
    console.error('Token no recibido del login. Abortar.');
    return;
  }
  // Rebind AUTH_TOKEN for subsequent requests
  process.env.AUTH_TOKEN = token;

  // 1) Crear reporte
  const createPayload = { title: 'Prueba API', description: 'Reporte de prueba desde script', latitude: -12.0464, longitude: -77.0428, address: 'Lima', photos: [], priority: 'MEDIUM' };
  console.log('\n--- Crear reporte');
  const created = await request('/reports', { method: 'POST', body: JSON.stringify(createPayload) });
  console.log('Create status', created.status);
  console.log(JSON.stringify(created.body, null, 2));
  if (created.status !== 201) return;
  const report = created.body.report;

  // 2) Obtener mis reportes
  console.log('\n--- Obtener mis reportes');
  const myReports = await request('/reports/my-reports', { method: 'GET' });
  console.log('My reports status', myReports.status);
  console.log(JSON.stringify(myReports.body, null, 2));

  // 3) Intentar editar (dentro de ventana)
  console.log('\n--- Editar reporte (dentro de ventana)');
  const editPayload = { title: 'Prueba API - Editado', description: 'Editado dentro de ventana' };
  const edited = await request(`/reports/${report.id}`, { method: 'PUT', body: JSON.stringify(editPayload) });
  console.log('Edit status', edited.status);
  console.log(JSON.stringify(edited.body, null, 2));

  // 4) Intentar cancelar (debe funcionar mientras está PENDING)
  console.log('\n--- Cancelar reporte');
  const canceled = await request(`/reports/${report.id}/cancel`, { method: 'POST' });
  console.log('Cancel status', canceled.status);
  console.log(JSON.stringify(canceled.body, null, 2));

  // 5) Intentar eliminar (después de cancelar no debería permitir eliminar para ciudadano si status != PENDING)
  console.log('\n--- Eliminar reporte');
  const deleted = await request(`/reports/${report.id}`, { method: 'DELETE' });
  console.log('Delete status', deleted.status);
  console.log(JSON.stringify(deleted.body, null, 2));

  // 6) Crear un reporte con createdAt antiguo para probar ventanas (esto script no puede setear createdAt fácilmente si prisma no lo permite via endpoint). Informe manual.
  console.log('\n--- Nota: para probar ventanas expandidas (3/6 días) modificar createdAt directamente en la base de datos o crear helper de test en backend.');
}

run().catch(err => { console.error(err); process.exit(1); });
