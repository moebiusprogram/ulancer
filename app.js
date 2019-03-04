const express   = require('express')
const path      = require('path')
const favicon   = require('serve-favicon')
const logger    = require('morgan')
const cors      = require('cors')
const mongoose  = require('mongoose')
const passport  = require('passport')
const cookieParser  = require('cookie-parser')
const bodyParser    = require('body-parser')
const databaseConf    = require('./config/remote.config.js')
//const databaseConf  = require('./config/database.config.js')
const constants     = require('./config/constants.config')

mongoose.Promise = global.Promise

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')) )

mongoose.connect(databaseConf.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Connected to database")
}).catch(err => {
    console.log('Error connecting with db: ', err )
    process.exit()
})
mongoose.set('debug', true)

require('./models/accounts.model')
require('./models/profile.model')

const model = [
      {
        name: 'Curso de Diseño Web',
        author: 'José Javier Villena',
        rating: 2,
        students: 8,
        image: '/images/cursos/1.jpg'
      },
      {
        name: 'Gestión de Proyectos Pequeños',
        author: 'Darwin Campoverde',
        rating: 3,
        students: 12,
        image: '/images/cursos/2.png'
      },
      {
        name: 'Yogashala - Danzando con el corazón',
        author: 'Fundación Yogashala',
        rating: 5,
        students: 4,
        image: '/images/cursos/3.png'
      },
      {
        name: 'Adobe Lightroom 5. The Library and Develop Modules',
        author: 'Santi Kierulf',
        rating: 3,
        students: 14,
        image: '/images/cursos/4.jpg'
      },
      {
        name: 'Aprende Coaching y Liderazgo Modulo 0',
        author: 'Francisco Lopez',
        rating: 4,
        students: 12,
        image: '/images/cursos/5.png'
      },
      {
        name: 'Gana un Sueldo 2.0 trabajando como Freelancer',
        author: 'Jesus Planas',
        rating: 3,
        students: 5,
        image: '/images/cursos/6.png'
      },
      {
        name: 'Curso de Ingles - Nivel Alto',
        author: 'Alberto Carranza',
        rating: 4,
        students: 13,
        image: '/images/cursos/7.png'
      },
      {
        name: 'Taller de Inicio al manejo de smartphones y tablets Android',
        author: 'Juan Ríos',
        rating: 5,
        students: 9,
        image: '/images/cursos/8.jpg'
      },
      {
        name: 'Clima Organizacional',
        author: 'Stefany Mestre',
        rating: 3,
        students: 16,
        image: '/images/cursos/9.png'
      },
      {
        name: 'Master Time Management in 2 Hours! - Productivity Guide',
        author: 'Shawn Malkou',
        rating: 2,
        students: 2,
        image: '/images/cursos/10.jpg'
      },
      {
        name: 'Síntesis: Diseño Sonoro',
        author: 'Rodrigo Robles',
        rating: 1,
        students: 0,
        image: '/images/cursos/11.png'
      },
      {
        name: 'Aprende Programación desde cero con Diagramas de Flujo',
        author: 'por alejandro meza',
        rating: 3,
        students: 4,
        image: '/images/cursos/12.jpg'
      },
      {
        name: 'Administración Básica Con Sql Server',
        author: 'Denis Guido',
        rating: 4,
        students: 6,
        image: '/images/cursos/13.jpg'
      },
      {
        name: 'Curso Básico de Salsa',
        author: 'Chocolifestyle',
        rating: 2,
        students: 9,
        image: '/images/cursos/14.png'
      },
      {
        name: 'Curso de Edición de Videos con Camtasia',
        author: 'Rubén Molinero',
        rating: 2,
        students: 20,
        image: '/images/cursos/15.jpg'
      },
      {
        name: 'Gánate la vida jugando videojuegos: La Manera Realista',
        author: 'Marcos Gutiérrez',
        rating: 4,
        students: 2,
        image: '/images/cursos/16.jpg'
      },
      {
        name: 'Género, igualdad de trato y lucha contra la discriminación',
        author: 'María Vega',
        rating: 5,
        students: 4,
        image: '/images/cursos/17.jpg'
      },
      {
        name: 'Email Writing Masterclass: Fix these 5 mistakes',
        author: 'Daria Storozhilova',
        rating: 4,
        students: 12,
        image: '/images/cursos/18.png'
      },
      {
        name: 'EXCEL 2013 para profesionales y directivos',
        author: 'por Federico Huércano',
        rating: 3,
        students: 11,
        image: '/images/cursos/19.png'
      },
      {
        name: 'Como Criar um Site ou Blog com WordPress em 2 horas',
        author: 'por Mike Omar',
        rating: 2,
        students: 5,
        image: '/images/cursos/20.jpg'
      },
      {
        name: '1 Hour Japanese The Most Important Aspects Fast and Easy',
        author: 'Pedro Planas',
        rating: 2,
        students: 4,
        image: '/images/cursos/21.jpg'
      }
    ]
const { Courses }  = require('./models/courses.model')

var setCourses =  () => {
    model.map( async (m) => {
        const data = {
            name: m.name,
            teacher: m.author,
            image: m.image,
            score: m.rating,
            students: m.students,
            wishes: 0
        }
        await Courses.create( data )
    })
}


const accountsRoutes = require('./routes/accounts.route')

app.use("/", accountsRoutes)
    
module.exports = app
