import supertest from 'supertest'
import { expect } from 'chai'
import app from '../app.js'

const request = supertest(app)

describe('User API', () => {
  let createdUserId

  it('should create a new user', async () => {
    const res = await request.post('/user/register')
      .send({
        username: 'flerkenzuelo',
        password: 'flerkenzuelo',
        email: 'flerkenzuelo@email.com'
      })

    expect(res.status).to.equal(201)
    expect(res.body.message).to.equal('Usuario registrado exitosamente')

    // Almacenar el ID del usuario creado para futuras pruebas o limpieza.
    createdUserId = res.body.user.id
  })

  it('should not create a user with invalid email', async () => {
    const res = await request.post('/user/register')
      .send({
        username: 'flerkenzuelo',
        password: 'flerkenzuelo',
        email: 'notAnEmail'
      })
    expect(res.status).to.equal(400)
  })

  it('should login with the new user', async () => {
    const res = await request.post('/user/login')
      .send({
        username: 'flerkenzuelo',
        password: 'flerkenzuelo'
      })

    expect(res.status).to.equal(200)
    expect(res.body.message).to.equal('Inicio de sesión exitoso')
  })

  // Un hook "after" para limpiar: eliminar el usuario creado después de que las pruebas hayan terminado.
  after(async () => {
    if (createdUserId) {
      const res = await request.delete(`/user/${createdUserId}`)
      // Opcional: añadir alguna aserción o logging aquí para manejar fallos en la eliminación.
      expect(res.status).to.equal(200)
    }
  })
})
