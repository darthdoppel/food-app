import supertest from 'supertest'
import { expect } from 'chai'
import app from '../app.js'

const request = supertest(app)

describe('Restaurant API - POST /restaurants', () => {
  let token
  let createdRestaurantId // Almacenaremos aquí el ID del restaurante creado

  before(async () => {
    // Log in and get JWT token
    const res = await request.post('/user/login')
      .send({ username: 'tostada', password: 'tostada' })

    expect(res.status).to.equal(200)
    expect(res.body).to.have.property('token')

    token = res.body.token
  })

  it('should create a new restaurant with valid data', async () => {
    const newRestaurant = {
      name: 'Test Restaurant',
      location: 'Test Location',
      image: 'https://testimageurl.com',
      description: 'Test Description'
    }

    const res = await request.post('/restaurants')
      .set('Authorization', `Bearer ${token}`)
      .send(newRestaurant)

    expect(res.status).to.equal(200)
    expect(res.body.data.name).to.equal(newRestaurant.name)
    expect(res.body.data.location).to.equal(newRestaurant.location)

    // Almacenar el ID del restaurante creado para futuras pruebas o limpieza.
    createdRestaurantId = res.body.data.id
  })

  // Un hook "after" para limpiar: eliminar el restaurante creado después de que las pruebas hayan terminado.
  after(async () => {
    if (createdRestaurantId && createdRestaurantId !== 0) {
      const res = await request.delete(`/restaurants/${createdRestaurantId}`)
        .set('Authorization', `Bearer ${token}`)
      console.log('Delete response:', res.status, res.body)
      expect(res.status).to.equal(200)
    } else {
      console.log('No restaurant to delete or ID is 0')
    }
  })

  it('should not create a new restaurant with invalid data', async () => {
    const invalidRestaurant = {
      name: 'Test Restaurant',
      location: 'Test Location',
      image: 'not_a_valid_url'
    }

    const res = await request.post('/restaurants')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidRestaurant)

    expect(res.status).to.equal(400)
    expect(res.body).to.have.property('message', 'Validation failed')
  })
})
