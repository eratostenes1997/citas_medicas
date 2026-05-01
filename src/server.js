const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const users = [
    { username: "admin", password: "123456" },
    { username: "doctor", password: "medico123" }
]

// ==============================
// LOGIN UI PRO
// ==============================
app.get('/', (req, res) => {
    res.send(`
    <html>
    <head>
        <title>Medical System</title>
        <style>
            body {
                margin: 0;
                font-family: 'Segoe UI', sans-serif;
                background: linear-gradient(135deg, #0f172a, #1e3a8a);
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
            }
            .card {
                background: rgba(255,255,255,0.05);
                backdrop-filter: blur(10px);
                padding: 40px;
                border-radius: 15px;
                width: 320px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            }
            input {
                width: 100%;
                padding: 12px;
                margin: 10px 0;
                border-radius: 8px;
                border: none;
            }
            button {
                width: 100%;
                padding: 12px;
                background: #22c55e;
                border: none;
                color: white;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
            }
            button:hover {
                background: #16a34a;
            }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>🏥 Medical Login</h1>
            <form method="POST" action="/login">
                <input name="username" placeholder="Usuario"/>
                <input name="password" type="password" placeholder="Contraseña"/>
                <button>Ingresar</button>
            </form>
        </div>
    </body>
    </html>
    `)
})

// ==============================
// LOGIN
// ==============================
app.post('/login', (req, res) => {
    const { username, password } = req.body

    const user = users.find(u => u.username == username && u.password == password)

    if (user) {
        global.session = true
        res.redirect('/dashboard?user=' + username)
    } else {
        res.send("❌ Credenciales inválidas")
    }
})

// ==============================
// DASHBOARD PRO
// ==============================
app.get('/dashboard', (req, res) => {

    if (!global.session) {
        return res.send("❌ No autenticado")
    }

    const user = req.query.user

    res.send(`
    <html>
    <head>
        <style>
            body {
                margin: 0;
                font-family: 'Segoe UI', sans-serif;
                background: #020617;
                color: white;
            }
            .header {
                background: #1e293b;
                padding: 15px;
                text-align: center;
                font-size: 20px;
            }
            .container {
                padding: 40px;
                display: flex;
                justify-content: center;
            }
            .card {
                background: #1e293b;
                padding: 25px;
                border-radius: 15px;
                width: 350px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            }
            input {
                width: 100%;
                padding: 10px;
                margin: 10px 0;
                border-radius: 8px;
                border: none;
            }
            button {
                width: 100%;
                padding: 10px;
                background: #22c55e;
                border: none;
                color: white;
                border-radius: 8px;
                cursor: pointer;
            }
            button:hover {
                background: #16a34a;
            }
        </style>
    </head>
    <body>
        <div class="header">
            🏥 Panel Médico - Bienvenido Dr. ${user}
        </div>

        <div class="container">
            <div class="card">
                <h3>Agendar nueva cita</h3>
                <form method="GET" action="/appointment">
                    <input name="patient" placeholder="Nombre del paciente"/>
                    <input name="date" placeholder="Fecha (YYYY-MM-DD)"/>
                    <button>Guardar cita</button>
                </form>
            </div>
        </div>
    </body>
    </html>
    `)
})

// ==============================
// RESULTADO CITA (XSS)
// ==============================
app.get('/appointment', (req, res) => {
    const patient = req.query.patient
    const date = req.query.date

    res.send(`
    <html>
    <body style="font-family: Arial; background:#0f172a; color:white; text-align:center;">
        <h1>📋 Cita registrada</h1>
        <p>Paciente: ${patient}</p>
        <p>Fecha: ${date}</p>
        <a href="/dashboard?user=admin">Volver</a>
    </body>
    </html>
    `)
})

app.listen(3000, () => {
    console.log("Medical UI PRO running on http://localhost:3000")
})