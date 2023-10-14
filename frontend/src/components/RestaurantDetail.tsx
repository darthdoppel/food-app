import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchRestaurant, fetchReviews, fetchUser, handleCreateReviewService, updateReview, deleteRestaurant, updateRestaurantImage } from '../services/ApiService'
import { Button, useDisclosure, Chip } from '@nextui-org/react'
import { toast } from 'sonner'
import useAuthStore from '../store/authStore'
import AddReviewModal from './modals/AddReviewModal'
import ReviewList from './ReviewList'
import EditReviewModal from './modals/EditReviewModal'
import { useRestaurantStore } from '../store/restaurantStore'
import DeleteModal from './modals/DeleteModal'
import UpdateImageModal from './modals/UpdateImageModal'

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { user, token } = useAuthStore((state) => ({ user: state.user, token: state.token }))
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onOpenChange: onEditModalOpenChange } = useDisclosure()
  const { isOpen: isDeleteModalOpen, onOpen: onOpenDeleteModal, onOpenChange: onOpenChangeDeleteModal } = useDisclosure()
  const { isOpen: isImageModalOpen, onOpen: onOpenImageModal, onOpenChange: onOpenChangeImageModal } = useDisclosure()

  // Using selectors and actions from restaurantStore
  const restaurant = useRestaurantStore((state) => state.restaurant)
  const reviews = useRestaurantStore((state) => state.reviews)
  const users = useRestaurantStore((state) => state.users)
  const setRestaurant = useRestaurantStore((state) => state.setRestaurant)
  const setReviews = useRestaurantStore((state) => state.setReviews)
  const setUsers = useRestaurantStore((state) => state.setUsers)

  const [editingReview, setEditingReview] = useState<{ rating: number, comment: string, id: string } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (id == null) {
          console.error('ID is undefined')
          return
        }

        const restaurantData = await fetchRestaurant(id, token)
        setRestaurant(restaurantData)

        const reviewsData = await fetchReviews(id, token)
        setReviews(() => reviewsData)

        const userIds = [...new Set(reviewsData.map((review: Review) => review.userId))]
        const usersData = await Promise.all(userIds.map(async (userId) => {
          try {
            const userData = await fetchUser(userId as number, token)
            return userData.user
          } catch (error) {
            console.error(`Failed to fetch user with ID: ${String(userId)}`, error)
            return null
          }
        }))

        setUsers(() => usersData.filter(user => user !== null))
      } catch (error) {
        console.error('Error fetching the data:', error)
      }
    }

    void fetchData()
  }, [id, setRestaurant, setReviews, setUsers])

  if (restaurant == null) return <p>Loading...</p>

  const handleEditReview = (review: { rating: number, comment: string, id: string }) => {
    setEditingReview(review)
    onEditModalOpen()
  }

  const handleUpdateReview = async (updatedReview: { rating: number, comment: string, id: string }) => {
    try {
      await updateReview(updatedReview, token)
      const newReviews = reviews.map((r) => r.id === updatedReview.id ? { ...r, ...updatedReview } : r)
      setReviews(() => newReviews)
      onEditModalOpenChange()
      toast.success('Review updated successfully!')
    } catch (error) {
      console.error('Failed to update review:', error)
      toast.error('Failed to update review. Please try again later.')
    }
  }

  const handleCreateReview = async (newReview: { rating: string, comment: string }) => {
    try {
      const ratingNumber = Number(newReview.rating)

      if (isNaN(ratingNumber) || newReview.comment === '' || ratingNumber < 1 || ratingNumber > 5) {
        toast.message('Please enter a valid rating (1-5) and comment.')
        return
      }

      const restaurantId = restaurant?.id
      const userId = user?.id

      // Verificación de existencia
      if ((restaurantId.length === 0) || userId === undefined || token == null) {
        toast.error('Missing user, restaurant, or authentication information.')
        return
      }

      // Si es un nuevo usuario, actualizar `users` primero
      if (!users.some(u => u.id === userId)) {
        const newUserResponse = await fetchUser(userId, token) // Asegúrate de que esto es await-ed
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (newUserResponse?.user) {
          setUsers(prevUsers => [...prevUsers, newUserResponse.user])
        } else {
          console.error('Failed to fetch new user data')
        }
      }

      const createdReview = await handleCreateReviewService({
        userId,
        restaurantId: restaurant?.id,
        rating: parseFloat(newReview.rating),
        comment: newReview.comment
      }, token)
      setReviews(prevReviews => [...prevReviews, createdReview])
      console.log('Created review acaaa:', createdReview)

      toast.success('Review created successfully!')
      onOpenChange()
    } catch (error) {
      console.error('Failed to create review:', error)
      toast.error('Failed to create review. Please try again later.')
    }
  }

  const handleDeleteRestaurant = async () => {
    try {
      if (id == null || token == null) {
        console.error('ID or token is undefined')
        return
      }

      await deleteRestaurant(id, token)
      toast.success('Restaurant deleted successfully!')
      await new Promise(resolve => setTimeout(resolve, 500))
      window.location.href = '/'
    } catch (error) {
      console.error('Failed to delete restaurant:', error)
      toast.error('Failed to delete restaurant. Please try again later.')
    }
  }

  const handleUpdateImage = async (newImageUrl: string) => {
    try {
      if (id == null || token == null) {
        console.error('ID or token is undefined')
        return
      }

      // Call your API to update the image
      await updateRestaurantImage(id, newImageUrl, token)

      // Update the image in the local state
      setRestaurant({ ...restaurant, image: newImageUrl })

      toast.success('Image updated successfully!')
    } catch (error) {
      console.error('Failed to update image:', error)
      toast.error('Failed to update image. Please try again later.')
    }
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen pb-10">
          <div className="relative text-center w-full overflow-hidden h-96 flex items-center justify-center -mt-20">
              <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full object-cover h-64 md:h-full"
              />
          <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent z-10" />
          <h1 className="absolute top-1/3 md:top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl md:text-4xl font-bold text-white z-20">
              {restaurant.name}
          </h1>
          <Chip
              color="default"
              variant="shadow"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
          >
              {restaurant.location}
          </Chip>
      </div>

      {/* Mostrar el promedio de calificaciones */}
      <div className="flex items-center justify-center ml-4 mt-4 mb-4 space-x-2 sm:mx-auto">
              <span className="text-lg font-semibold">
                  Average Rating:
              </span>
              <Chip
              color="primary"
              variant='dot'
              >
                  {
                      (restaurant.average_rating !== 0)
                        ? (typeof restaurant.average_rating === 'number'
                            ? restaurant.average_rating
                            : parseFloat(restaurant.average_rating)
                          ).toFixed(2)
                        : 'N/A'
                  }
              </Chip>
          </div>

          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-4 mb-4 mx-4 md:mx-0 justify-center md:justify-start md:ml-4 items-center">
  <Button
    onPress={onOpen}
    color="success"
    variant="ghost"
    className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 w-full md:w-auto"
  >
    Add Review
  </Button>
  <AddReviewModal
    isOpen={isOpen}
    onOpenChange={onOpenChange}
    onCreateReview={handleCreateReview}
  />
  <Button
    onPress={onOpenDeleteModal}
    color="danger"
    variant="ghost"
    className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 w-full md:w-auto"
  >
    Delete Restaurant
  </Button>
  <Button
    onPress={onOpenImageModal}
    color="warning"
    variant="ghost"
    className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 w-full md:w-auto"
  >
    Update Image
  </Button>
</div>

      <UpdateImageModal
        isOpen={isImageModalOpen}
        onOpenChange={onOpenChangeImageModal}
        onUpdateImage={handleUpdateImage}
      />

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onOpenChange={onOpenChangeDeleteModal}
          onDeleteConfirm={() => {
            void handleDeleteRestaurant()
          }}
        />

    <ReviewList onEditReview={handleEditReview} />

      <EditReviewModal
          isOpen={isEditModalOpen}
          onOpenChange={onEditModalOpenChange}
          review={editingReview}
          onUpdateReview={handleUpdateReview}
          reviewId={editingReview?.id ?? ''}
      />

    </div>
  )
}

export default RestaurantDetail
