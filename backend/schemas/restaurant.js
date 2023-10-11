import { z } from 'zod'

const restaurantSchema = z.object({
  name: z.string().nonempty({ message: 'Please provide a name for the restaurant.' }),
  location: z.string().nonempty({ message: 'Please provide a location for the restaurant.' }),
  image: z.string().url({ message: 'Please enter a valid URL for the image.' }),
  description: z.string().optional(),
  averageRating: z.number().optional()
})

export default restaurantSchema
