import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardFooter, Image, Skeleton } from '@nextui-org/react'
import { Link } from 'react-router-dom'
import { fetchRestaurants, createRestaurant } from '../services/ApiService'
import AddRestaurantModal from './modals/AddRestaurantModal'
import { useRestaurantStore } from '../store/restaurantStore'

// eslint-disable-next-line react/display-name
const LoadingSkeleton = React.memo(() => (
  <Card className="max-w-sm w-full h-[200px] overflow-hidden">
      <Skeleton className="rounded-lg">
          <div className="h-[140px] rounded-lg bg-default-300"></div>
      </Skeleton>
      <div className="space-y-3 p-4">
          <Skeleton className="w-3/5 rounded-lg">
              <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
              <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
          </Skeleton>
      </div>
  </Card>
))

const RestaurantList: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const restaurants = useRestaurantStore((state) => state.restaurants)
  const setRestaurants = useRestaurantStore((state) => state.setRestaurants)

  const handleCreateRestaurant = async (newRestaurant: { name: string, location: string, image: string }): Promise<Restaurant> => {
    try {
      const token = localStorage.getItem('token')
      const createdRestaurant = await createRestaurant(newRestaurant, token)
      setIsModalOpen(false)

      // Llama a una función para actualizar los restaurantes desde el servidor.
      void updateRestaurantsFromServer()

      return createdRestaurant
    } catch (error) {
      console.error('Error creating the restaurant:', error)
      throw error
    }
  }

  const updateRestaurantsFromServer = async () => {
    try {
      const restaurantsData = await fetchRestaurants()
      setRestaurants(restaurantsData)
    } catch (error) {
      console.error('Error fetching the pizzerias:', error)
    }
  }

  useEffect(() => {
    const fetchAllRestaurants = async () => {
      try {
        const restaurantsData = await fetchRestaurants()
        setRestaurants(restaurantsData)
      } catch (error) {
        console.error('Error fetching the pizzerias:', error)
      } finally {
        setLoading(false)
      }
    }

    void fetchAllRestaurants()
  }, [setRestaurants])

  const sortedRestaurants = [...restaurants].sort((a, b) => a.name.localeCompare(b.name))

  return (
        <div className="px-4 mx-auto">
            <div className="my-4">
            <Button
          color="primary"
          variant="solid"
          onClick={() => { setIsModalOpen(true) }}
          className="w-full sm:w-auto" // <-- Clases de Tailwind para ancho completo en móviles y ancho automático en vistas más grandes
        >
          Add Restaurant
        </Button>
                <AddRestaurantModal
                    isOpen={isModalOpen}
                    onOpenChange={() => { setIsModalOpen(!isModalOpen) }}
                    onCreateRestaurant={handleCreateRestaurant}
                />
            </div>
            <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center">
                {loading
                  ? Array(6)
                    .fill(null)
                    .map((_, index) => <LoadingSkeleton key={index} />)
                  : sortedRestaurants.map((restaurant) => (
                      <Card
                            shadow="sm"
                            key={restaurant.id}
                            isPressable
                            onPress={() => { console.log('restaurant pressed') }}
                            className="max-w-sm w-full h-[200px] overflow-hidden"
                            as={Link}
                            to={`/restaurants/${restaurant.id}`}
                        >
                            <CardBody className="overflow-visible p-0">
                                <Image
                                    isZoomed
                                    shadow="sm"
                                    radius="lg"
                                    width="100%"
                                    alt={restaurant.name}
                                    className="w-full object-cover h-[140px]"
                                    src={restaurant.image}
                                />
                            </CardBody>
                            <CardFooter className="text-small justify-between">
                                <b>{restaurant.name}</b>
                                <p className="text-default-500">{restaurant.location}</p>
                            </CardFooter>
                        </Card>
                  ))}
            </div>
        </div>
  )
}

export default RestaurantList
