// tests/reviews.test.js

import supertest from 'supertest'
import { expect } from 'chai'
import app from '../app.js'

const request = supertest(app)

describe('Review API - PATCH /reviews/:id', () => {
  let token

  before(async () => {
    // Log in and get JWT token
    const res = await request.post('/user/login')
      .send({ username: 'tostada', password: 'tostada' })

    expect(res.status).to.equal(200)
    expect(res.body).to.have.property('token')

    token = res.body.token
  })

  it('should update a review', async () => {
    const reviewId = 43

    const updatedReviewData = {
      rating: 4,
      comment: 'safa'
    }

    const res = await request.patch(`/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedReviewData)

    expect(res.status).to.equal(200)
    console.log('Response body:', res.body)
    expect(res.body.data).to.include(updatedReviewData)
  })
})
