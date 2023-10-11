import React, { useState } from 'react'
import StarRating from './StarRating'
import { Avatar, Divider, useDisclosure, Tooltip } from '@nextui-org/react'
import useAuthStore from '../store/authStore'
import { EditIcon } from '../icons/EditIcon'
import { DeleteIcon } from '../icons/DeleteIcon'
import { useRestaurantStore } from '../store/restaurantStore'
import DeleteReviewModal from './modals/DeleteReviewModal'
import { deleteReview } from '../services/ApiService'
import { toast } from 'sonner'

interface ReviewListProps {
  reviews: Review[]
  users: User[]
  onEditReview: (review: { rating: number, comment: string, id: string }) => void
}

const ReviewList: React.FC<ReviewListProps> = ({ onEditReview }) => {
  const user = useAuthStore(state => state.user)
  const token = useAuthStore(state => state.token) // Asegúrate de tener una forma de obtener el token
  const reviews = useRestaurantStore(state => state.reviews)
  const users = useRestaurantStore(state => state.users)
  const { isOpen: isDeleteModalOpen, onOpen: onOpenDeleteModal, onOpenChange: onOpenChangeDeleteModal } = useDisclosure()
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null)

  const handleDeleteReview = async () => {
    if (reviewToDelete != null) {
      try {
        // Intenta eliminar la reseña en el servidor
        await deleteReview(reviewToDelete, token)

        // Si se tiene éxito, elimina la reseña del estado en el cliente
        useRestaurantStore.getState().setReviews((prevReviews) =>
          prevReviews.filter((review) => review.id !== reviewToDelete)
        )
        toast.success('Review deleted successfully')

        onOpenChangeDeleteModal()
      } catch (error) {
        console.error('Error deleting review:', error)
        // Opcionalmente, maneja este error mostrando un mensaje al usuario
      }
    }
  }

  return (
    <div className="mt-10 px-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Reviews</h2>
      {
        reviews.length === 0
          ? <p className="text-gray-700 dark:text-gray-300">No reviews yet.</p>
          : reviews.map((review) => {
            const reviewUser = users.find((u) => u.id === review.userId)
            return (
              <div key={review.id} className="bg-white dark:bg-gray-800 rounded-md p-4 mb-4 shadow-sm">
                {reviewUser != null
                  ? (
                    <div className="flex flex-col mt-2 mb-4">
                      <Avatar
                        isBordered
                        size="lg"
                        src={reviewUser.avatar ?? 'https://i.pravatar.cc/150?u=a04258114e29026702d'}
                      />
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{reviewUser.username}</p>
                    </div>
                    )
                  : (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Reviewed by: Loading user...</p>
                    )}
                <Divider />
                <div className="mt-4">
                  <StarRating rating={review.rating} />
                  <p className="text-gray-700 dark:text-gray-300 mt-2">{review.comment}</p>
                </div>
                {user?.id === review.userId && (
                <div className="mt-2 flex space-x-2">
                  <Tooltip content="Edit Review">
                    <div className="cursor-pointer" onClick={() => { onEditReview(review) }}>
                      <EditIcon />
                    </div>
                  </Tooltip>
                  <Tooltip content="Delete Review">
                      <div className="cursor-pointer" onClick={() => { setReviewToDelete(review.id); onOpenDeleteModal() }}>
                          <DeleteIcon />
                      </div>
                  </Tooltip>
                </div>
                )}
                <DeleteReviewModal
                  isOpen={isDeleteModalOpen}
                  onOpenChange={onOpenChangeDeleteModal}
                  onDeleteConfirm={handleDeleteReview}
                />
              </div>
            )
          })
      }
    </div>
  )
}

export default ReviewList
