const mysql = require('mysql')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

const PORT = process.env.PORT || 3000
const app = express()
app.use(bodyParser.json())
app.use(cors())
const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
})

app.get('/', (request, response) => {
    response.send('<h2>Hola a todos de nuevo</h2>')
})

app.get('/tareas', (req, res) => {
    const sql = 'SELECT * FROM tarea'
    conexion.query(sql, (error, response) => {
        if (error) throw error

        if (response.length > 0) {
            res.status(200).json(response)
        } else {
            res.status(200).json({
                'mensaje': 'Tabla vacia'
            })
        }
    })
})

app.get('/tarea/:id', (req, res) => {
    const { id } = req.params
    const sql = 'SELECT * FROM tarea WHERE id = ' + id
    conexion.query(sql, (error, response) => {
        if (error) throw error

        if (response.length > 0) {
            res.status(200).json(response)
        } else {
            res.status(200).json({
                'mensaje': 'La tarea no existe'
            })
        }
    })
})

app.post('/tareas', (req, res) => {
    const sql = 'INSERT INTO tarea SET ?'
    const datos = {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        estado: 0
    }

    conexion.query(sql, datos, (error, response) => {
        if (error) throw error

        if (response.affectedRows == 1) {
            res.status(200).json({
                'mensaje': 'Tarea agregada'
            })
        } else {
            res.status(404).json({
                'mensaje': 'Error'
            })
        }
    })
})

app.delete('/tarea/:id', (req, res) => {
    const { id } = req.params
    const sql = 'DELETE FROM tarea WHERE id = ' + id

    conexion.query(sql, (error, response) => {
        if (error) throw error

        if (response.affectedRows == 1) {
            res.status(200).json({
                'mensaje': 'Tarea eliminada'
            })
        } else {
            res.status(404).json({
                'mensaje': 'La tarea no existe'
            })
        }
    })
})

app.put('/tarea/:id', (req, res) => {
    const { id } = req.params
    const estado = req.body.estado
    const titulo = req.body.titulo
    const descripcion = req.body.descripcion
    let sql = ''
    if (estado != null) {
        const datos = {
            estado: estado
        }
        sql = 'UPDATE tarea SET estado = ' + datos.estado + ' WHERE id = ' + id
    } else {
        const datos = {
            titulo: titulo,
            descripcion: descripcion
        }
        sql = 'UPDATE tarea SET titulo = "' + datos.titulo + '", descripcion = "' + datos.descripcion + '" WHERE id = ' + id
    }

    conexion.query(sql, (error, response) => {
        if (error) throw error

        if (response.affectedRows == 1) {
            res.status(200).json({
                'mensaje': 'Tarea editada'
            })
        } else {
            res.status(404).json({
                'mensaje': 'El registro no existe'
            })
        }
    })
})



app.listen(PORT, () => {
    console.log('Servidor ejecutandose en el puerto ' + PORT)
})

