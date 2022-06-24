const express   = require('express')
const path      = require('path')
const favicon   = require('serve-favicon')
const logger    = require('morgan')
const cors      = require('cors')
const mongoose  = require('mongoose')
const passport  = require('passport')
const cookieParser  = require('cookie-parser')
const bodyParser    = require('body-parser')
//const databaseConf    = require('./config/remote.config.js')
const databaseConf  = require('./config/database.config.js')
const constants     = require('./config/constants.config')

mongoose.Promise = global.Promise

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')) )
app.use(express.static(path.join(__dirname, 'public/images')) )


mongoose.connect( 'mongodb://localhost:27017/ulancer' , {
    useNewUrlParser: true,
    useUnifiedTopology: true
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
        name: 'Diseño Web',
        author: 'José Javier Villena',
        rating: 2,
        students: 8,
        image: '/images/servicios/1.jpg'
      },
      {
        name: 'Gestión de Proyectos Pequeños',
        author: 'Darwin Campoverde',
        rating: 3,
        students: 12,
        image: '/images/servicios/2.png'
      },
      {
        name: 'Especialista en Adobe Lightroom 5',
        author: 'Santi Mendoza',
        rating: 3,
        students: 14,
        image: '/images/servicios/4.jpg'
      },
      {
        name: 'Asistente Virtual',
        author: 'Francisco Lopez',
        rating: 4,
        students: 12,
        image: '/images/servicios/5.png'
      },
      {
        name: 'Diseñador Gráfico',
        author: 'Jesus Planas',
        rating: 3,
        students: 5,
        image: '/images/servicios/6.png'
      },
      {
        name: 'Traducciones de Inglés',
        author: 'Alberto Carranza',
        rating: 4,
        students: 13,
        image: '/images/servicios/7.png'
      },
      {
        name: 'Community Manager',
        author: 'Juan Ríos',
        rating: 5,
        students: 9,
        image: '/images/servicios/8.jpg'
      },
      {
        name: 'Asistente Virtual 2',
        author: 'Stefany Mestre',
        rating: 3,
        students: 16,
        image: '/images/servicios/9.png'
      },
      {
        name: 'Gestión de Proyectos',
        author: 'Shawn Malkou',
        rating: 2,
        students: 2,
        image: '/images/servicios/10.jpg'
      },
      {
        name: 'Creación y producción audiovisual',
        author: 'Rodrigo Robles',
        rating: 1,
        students: 0,
        image: '/images/servicios/11.png'
      },
      {
        name: 'Asesorías en Excel',
        author: 'por alejandro meza',
        rating: 3,
        students: 4,
        image: '/images/servicios/12.jpg'
      },
      {
        name: 'Programación de Sql Server',
        author: 'Denis Guido',
        rating: 4,
        students: 6,
        image: '/images/servicios/13.jpg'
      },
      {
        name: 'Edición de Videos con Camtasia',
        author: 'Rubén Molinero',
        rating: 2,
        students: 20,
        image: '/images/servicios/15.jpg'
      },
      {
        name: 'Creador de Videojuegos',
        author: 'Marcos Gutiérrez',
        rating: 4,
        students: 2,
        image: '/images/servicios/16.jpg'
      },
      {
        name: 'Asesoría Legal',
        author: 'María Vega',
        rating: 5,
        students: 4,
        image: '/images/servicios/17.jpg'
      },
      {
        name: 'Redacción de Correos',
        author: 'Daria Storozhilova',
        rating: 4,
        students: 12,
        image: '/images/servicios/18.png'
      },
      {
        name: 'EXCEL 2013',
        author: 'por Federico Huércano',
        rating: 3,
        students: 11,
        image: '/images/servicios/19.png'
      },
      {
        name: 'Instalaciones de Wordpress',
        author: 'por Mike Omar',
        rating: 2,
        students: 5,
        image: '/images/servicios/20.jpg'
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

//setCourses()

const accountsRoutes = require('./routes/accounts.route')

app.use("/", accountsRoutes)
    
module.exports = app
