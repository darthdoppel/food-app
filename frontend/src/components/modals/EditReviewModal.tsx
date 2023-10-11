import React, { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea } from '@nextui-org/react'
import RatingInput from '../RatingInput'

interface EditReviewModalProps {
  isOpen: boolean
  onOpenChange: () => void
  reviewId: string
  review: { rating: number, comment: string, id: string } | null
  onUpdateReview: (updatedReview: { rating: number, comment: string, id: string }) => Promise<void>
}

const EditReviewModal: React.FC<EditReviewModalProps> = ({ isOpen, onOpenChange, review, onUpdateReview }) => {
  const [updatedReview, setUpdatedReview] = useState({ rating: 0, comment: '', id: '' })

  // Este useEffect actualizará el estado local cuando se proporcione una nueva "review"
  useEffect(() => {
    if (review !== null) {
      setUpdatedReview(review)
    }
  }, [review])

  const handleRatingChange = (rating: string) => {
    setUpdatedReview((prevReview) => ({ ...prevReview, rating: Number(rating) }))
  }

  const handleCommentChange = (comment: string) => {
    setUpdatedReview((prevReview) => ({ ...prevReview, comment }))
  }

  const handleSubmit = () => {
    onUpdateReview(updatedReview)
      .then(() => {
        onOpenChange() // Cerrar el modal solo si la actualización fue exitosa
      })
      .catch((error) => {
        console.log(error)
        // Mostrar un mensaje de error al usuario, si es necesario.
      })
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Edit Your Review</ModalHeader>
            <ModalBody>
              <RatingInput
                initialRating={updatedReview.rating}
                onRatingChange={handleRatingChange}
              />
              <Textarea
                isRequired
                value={updatedReview.comment}
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

export default EditReviewModal
