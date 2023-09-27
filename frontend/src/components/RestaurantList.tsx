import React from 'react'
import { Card, CardBody, CardFooter, Image } from '@nextui-org/react'

const RestaurantList: React.FC = () => {
  const restaurants = [
    {
      name: 'La Buena Mesa',
      img: '/images/restaurant-1.jpeg',
      type: 'Italiana',
      location: 'Madrid, España'
    },
    {
      name: 'El Gourmet Andino',
      img: '/images/restaurant-2.jpeg',
      type: 'Peruana',
      location: 'Lima, Perú'
    },
    {
      name: 'La Casona',
      img: '/images/restaurant-3.jpeg',
      type: 'Mexicana',
      location: 'Ciudad de México, México'
    },
    {
      name: 'Sabor Ibérico',
      img: '/images/restaurant-4.jpeg',
      type: 'Española',
      location: 'Barcelona, España'
    },
    {
      name: 'Orient Express',
      img: '/images/restaurant-5.jpeg',
      type: 'China',
      location: 'Beijing, China'
    },
    {
      name: 'Le Gourmet',
      img: '/images/restaurant-6.jpeg',
      type: 'Francesa',
      location: 'París, Francia'
    },
    {
      name: 'Tokyo Bites',
      img: '/images/restaurant-7.jpeg',
      type: 'Japonesa',
      location: 'Tokyo, Japón'
    },
    {
      name: 'Casa Argentina',
      img: '/images/restaurant-8.jpeg',
      type: 'Argentina',
      location: 'Buenos Aires, Argentina'
    },
    {
      name: 'Savory Indian',
      img: '/images/restaurant-9.jpeg',
      type: 'India',
      location: 'Mumbai, India'
    },
    {
      name: 'Mama Africa',
      img: '/images/restaurant-10.jpeg',
      type: 'Africana',
      location: 'Cape Town, Sudáfrica'
    }
  ]

  return (
    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center px-4 mx-auto">
    {restaurants.map((restaurant, index) => (
        <Card
          shadow="sm"
          key={index}
          isPressable
          onPress={() => { console.log('restaurant pressed') }}
          className="max-w-sm w-full h-[200px] overflow-hidden"
        >
          <CardBody className="overflow-visible p-0">
            <Image
              shadow="sm"
              radius="lg"
              width="100%"
              alt={restaurant.name}
              className="w-full object-cover h-[140px]"
              src={restaurant.img}
            />
          </CardBody>
          <CardFooter className="text-small justify-between">
            <b>{restaurant.name}</b>
            <p className="text-default-500">{restaurant.type} - {restaurant.location}</p>
          </CardFooter>
        </Card>
    ))}
    </div>
  )
}

export default RestaurantList
