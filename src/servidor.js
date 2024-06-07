import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from './db.js'
import cors from 'cors'

const app = express();
const PORT = process.env.PORT || 3000
const secretKey = process.env.JWT_SECRET

app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
    console.error('Error no capturado:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
});


//----- HABITACIONES -----
// Consultar lista de usuarios registrados
app.get('/users', async (req, res, next) => {
    try {
        const query = 'SELECT * FROM users'
        const [rows] = await db.promise().query(query)
        res.json(rows)
    } catch (error) {
        console.log('Error al cargar lista de usuarios')
    }
})

// Ruta de logueo
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).send('Se requiere correo electrónico y contraseña')
        }

        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.promise().query(query, [email])

        if (rows.length > 0) {
            const user = rows[0]
            if (!user.password) {
                return res.status(500).send('No se encontró la contraseña del usuario en la base de datos')
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (validPassword) {
                const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' })
                res.json({ token });
            } else {
                res.status(401).send('Correo electronico o contraseña incorrectos')
            }
        } else {
            res.status(404).send('Correo electronico o contraseña incorrectos');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta de registro
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8)

        const query = 'INSERT INTO users (email, password) VALUES (?, ?)'
        const [result] = await db.promise().execute(query, [email, hashedPassword])

        const userId = result.insertId;
        const token = jwt.sign({ id: userId }, secretKey, { expiresIn: '1h' })

        res.status(201).json({ user: { id: userId, email }, token })
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'El email ya está registrado' })
        } else {
            console.error('Error en el registro:', error);
            res.status(500).json({ error: 'Error interno del servidor' })
        }
    }
});

// Consulta todas las habitaciones
app.get('/rooms', async (req, res, next) => {
    try {
        const query = 'SELECT * FROM habitaciones';
        const [rows] = await db.promise().query(query);
        res.json(rows);
    } catch (error) {
        next(error);
    }
});


// Consulta una habitación por código
app.get('/rooms/:codigo', async (req, res, next) => {
    try {
        const { codigo } = req.params;
        const query = 'SELECT * FROM `habitaciones` WHERE código = ?';
        const [rows] = await db.promise().query(query, [codigo]);
        if (rows.length === 0) {
            res.status(404).json({ error: 'Habitación no encontrada' });
        } else {
            res.json(rows[0]);
        }
    } catch (error) {
        next(error);
    }
});

// Crea una nueva habitación
app.post('/rooms', async (req, res, next) => {
    try {
        const { código, número, tipo, valor } = req.body;
        const query = 'INSERT INTO habitaciones (código, número, tipo, valor) VALUES (?, ?, ?, ?)';
        await db.promise().execute(query, [código, número, tipo, valor]);
        console.log(req.body);
        res.status(201).json({ message: 'Habitación creada exitosamente' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Ya existe una habitacion con el codigo' });
        } else {
            next(error);
        }
    }
});

// Actualiza una habitación por código
app.patch('/rooms/:codigo', async (req, res, next) => {
    try {
        const { número, tipo, valor, código } = req.body;
        const query = 'UPDATE habitaciones SET número = ?, tipo = ?, valor = ? WHERE código = ?';
        await db.promise().execute(query, [número, tipo, valor, código || null]);
        res.json({ message: 'Habitación actualizada exitosamente' });
    } catch (error) {
        next(error);
    }
});

// Elimina una habitación por código
app.delete('/rooms/:codigo', async (req, res, next) => {
    try {
        const { código } = req.params;
        const query = 'DELETE FROM habitaciones WHERE código = ?';
        await db.promise().execute(query, [código || null]);
        res.json({ message: 'Habitación eliminada exitosamente' });
    } catch (error) {
        next(error);
    }
});





//----- RESERVAS -----

// Consulta todas las reservas
app.get('/bookings', async (req, res, next) => {
    try {
        const query = 'SELECT * FROM `reservas`';
        const [rows] = await db.promise().query(query);
        res.json(rows);
    } catch (error) {
        next(error);
    }
});

// Consulta una reserva por código
app.get('/bookings/:codigo', async (req, res, next) => {
    try {
        const { codigo } = req.params;
        const query = 'SELECT * FROM reservas WHERE código = ?';
        const [rows] = await db.promise().query(query, [codigo]);
        if (rows.length === 0) {
            res.status(404).json({ error: 'Reserva no encontrada' });
        } else {
            res.json(rows[0]);
        }
    } catch (error) {
        next(error);
    }
});

// Crea una nueva reserva
app.post('/bookings', async (req, res, next) => {
    try {
        const { código, código_habitación, Nombre_cliente, telefono_cliente, fecha_reservación, fecha_entrada, fecha_salida } = req.body;
        const query = 'INSERT INTO `reservas` (código, código_habitación, Nombre_cliente, telefono_cliente, fecha_reservación, fecha_entrada, fecha_salida) VALUES (?, ?, ?, ?, ?, ?, ?)';
        await db.promise().execute(query, [código, código_habitación, Nombre_cliente, telefono_cliente, fecha_reservación, fecha_entrada, fecha_salida]);
        res.status(201).json({ message: 'Reserva creada exitosamente' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'La reserva ya existe' });
        } else {
            next(error);
        }
    }
});

// Actualiza una reserva por código
app.patch('/bookings/:codigo', async (req, res, next) => {
    try {
        const { código_habitación, Nombre_cliente, telefono_cliente, fecha_reservación, fecha_entrada, fecha_salida, código } = req.body;
        const query = 'UPDATE `reservas` SET código_habitación = ?, Nombre_cliente = ?, telefono_cliente = ?, fecha_reservación = ?, fecha_entrada = ?, fecha_salida = ? WHERE código = ?';
        await db.promise().execute(query, [código_habitación, Nombre_cliente, telefono_cliente, fecha_reservación, fecha_entrada, fecha_salida, código || null]);
        res.json({ message: 'Reserva actualizada exitosamente' });
    } catch (error) {
        next(error);
    }
});

// Elimina una reserva por código
app.delete('/bookings/:codigo', async (req, res, next) => {
    try {
        const { código } = req.params;
        const query = 'DELETE FROM reservas WHERE código = ?';
        await db.promise().execute(query, [código || null]);
        res.json({ message: 'Reserva eliminada exitosamente' });
    } catch (error) {
        next(error);
    }
});

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});