import React, { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea } from '@nextui-org/react'
import RatingInput from '../RatingInput'
import { handleCreateReviewService } from '../../services/ApiService'
import useAuthStore from '../../store/authStore'
import { useRestaurantStore } from '../../store/restaurantStore'

interface AddReviewModalProps {
  isOpen: boolean
  onOpenChange: () => void
  onCreateReview: (newReview: { rating: string, comment: string }) => Promise<void>
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({ isOpen, onOpenChange }) => {
  const [newReview, setNewReview] = useState({ rating: '', comment: '' })
  const { user, token } = useAuthStore() // Obtener user y token del store

  const handleRatingChange = (rating: string) => {
    setNewReview((prevReview) => ({
      ...prevReview,
      rating
    }))
  }

  const handleCommentChange = (comment: string) => {
    setNewReview((prevReview) => ({
      ...prevReview,
      comment
    }))
  }

  const handleSubmit = () => {
    if (user == null) {
      console.error('User is not authenticated!')
      return
    }

    const restaurantId = useRestaurantStore.getState().restaurant?.id

    if (restaurantId == null) {
      console.error('Restaurant ID is undefined!')
      return
    }

    // Crear un objeto de reseña con userId y restaurantId
    const reviewData = {
      rating: parseInt(newReview.rating, 10),
      comment: newReview.comment,
      userId: user.id,
      restaurantId
    }

    // Usar handleCreateReview para crear la reseña y actualizar el estado local
    handleCreateReviewService(reviewData, token)
      .then(() => {
        setNewReview({ rating: '', comment: '' })
        onOpenChange() // Cierra el modal
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Add Your Review</ModalHeader>
            <ModalBody>
              <RatingInput onRatingChange={handleRatingChange} />
              <Textarea
                isRequired
                value={newReview.comment}
                onChange={(e) => { handleCommentChange(e.target.value) }}
                label="Comment"
                placeholder="Share your thoughts..."
                type="textarea"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                Submit
              </Button>

            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default AddReviewModal
