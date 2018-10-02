# Criptopagos Backend

## Introducción

La manera más fácil y segura de aceptar Criptomonedas

## Documentación Criptopagos API V1
----

### Sign Up ###

  Retorna json con información de registro del usuario.

**Método:** `POST`

**URL**
```bash
http://cryptopagos-api.dreamlopers.com/api/v1/signup`
```
  
**Formato de JSON:**

```js
{
	"account": {
            "name": "Testing User",
            "email": "email@gmail.com",
            "phone": "04141212345",
            "password": "1234567",
            "document_type":  "cc",
            "document_number": "123456789",
            "type": "juridica"
        } 
}
```
**Respuesta exitosa:**
Código: `200`

**Contenido:** 

```js
{
    "success": true,
    "user": {
        "name": "Testing User",
        "email": "email@gmail.com",
        "phone": "04141212345",
        "document_type": "cc",
        "document_number": "123456789",
        "type": "juridica",
        "auth_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGVzdGluZyBVc2VyIiwiaWQiOiI1YmFkNTRhOWJlYjRmODE5ZDQ3NjVkZWQiLCJleHAiOjE1NDMyNzAwNjAsImlhdCI6MTUzODA4NjA2MH0.b52aYg__pTdbtaQW40e4PhHsiLcGSHi0xOQ5zTvd0Nk"
    }
```
**Respuestas con error:**

**CASO: Correo ya existe**

Código: `422`  - *Unprocessable entity*

**Contenido:** 

```js
{
    "success": false,
    "error": "Error, expected `email` to be unique. Value: `email@gmail.com`"
}
```
**CASO: Teléfono ya existe**

Código: `422`  - *Unprocessable entity*

**Contenido:** 

```js
{
    "success": false,
    "error": "Error, expected `phone` to be unique. Value: `04141212345`"
}
```
**CASO: Contraseña requerida**

Código: `422`  - *Unprocessable entity*

**Contenido:** 

```js
{
    "success": false,
    "error": "password is required"
}
```
**CASO: Correo requerido**
Código: `422`  - *Unprocessable entity*
**Contenido:** 

```js
{
    "success": false,
    "error": "email is required"
}
```
**CASO: Nombre requerido**

Código: `422`  - *Unprocessable entity*

**Contenido:** 

```js
{
    "success": false,
    "error": "name is required"
}
```
**CASO: Tipo de documento no válido**

Código: `422`  - *Unprocessable entity*

**Contenido:** 

```js
{
    "success": false,
    "error": "`xyz` is not a valid enum value for path `document_type`."
}
```
**CASO: Tipo de persona no válido**

Código: `422`  - *Unprocessable entity*

**Contenido:** 

```js
{
    "success": false,
    "error": "`juridicas` is not a valid enum value for path `type`."
}
```
----

### Sign In ###

  Retorna json con información de autorización del usuario.

**Método:** `POST`

**URL**
```bash
http://cryptopagos-api.dreamlopers.com/api/v1/signin`
```
  
**Formato de JSON:**

```js
account:{
    login: '04141212345',
    password: '1234567'
}
```
O también

```js
    account:{
        login: 'test@gmail.com',
        password: '1234567'
    }
```

**Respuesta exitosa:**
Código: `200`


**Contenido:** 

```js
{
    "success": true,
    "auth_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGVzdGluZyBVc2VyIiwiaWQiOiI1YmFkNWU0ZWJlYjRmODE5ZDQ3NjVkZjMiLCJleHAiOjE1NDMyNzI1NDAsImlhdCI6MTUzODA4ODU0MH0.1c_zXI0wM1D-w9SnwoyOL8yjoBFj3PzvFyaecHwy0yw"
}
```
**Respuesta con error:**
Código: `422`  - *Unprocessable entity*

**Contenido:**   

```js
{
    "success": false,
    "error": "Error validating account. Please verify data"
}
```
---
### Tecnología

Criptopagos utiliza proyectos de código abierto para su funcionamiento:

* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework [@tjholowaychuk]
* [Jasmine] - package of helper code for developing Jasmine projects for Node.js


### Instalación

### Desarrollo

### TODO

 - Incorporar nuevos endpoints para verificación de email y número de teléfono
