import React, { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react'
import { validateRestaurantData } from '../../services/ApiService'
import { toast } from 'sonner'

interface AddRestaurantModalProps {
  isOpen: boolean
  onOpenChange: () => void
  onCreateRestaurant: (newRestaurant: { name: string, location: string, image: string }) => Promise<Restaurant>
}

const AddRestaurantModal: React.FC<AddRestaurantModalProps> = ({ isOpen, onOpenChange, onCreateRestaurant }) => {
  const [newRestaurant, setNewRestaurant] = useState({ name: '', location: '', image: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewRestaurant((prevRestaurant) => ({
      ...prevRestaurant,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      const data = await validateRestaurantData(newRestaurant)

      if (data.isValid === false) {
        console.error('Invalid data:', data)
        const errorMessage = data.errors.map((err: { path: any, message: any }) => {
          if (err.path[0] === 'image' && (Boolean(err.message.includes('url')))) {
            return 'Image: Must be a valid URL'
          }
          return `${err.path.join('.')}: ${err.message}`
        }).join('\n')

        toast.error(`Invalid data:\n${errorMessage}`)
        throw new Error('Validation failed')
      }

      const response = await onCreateRestaurant(newRestaurant)
      console.log('Response:', response)

      if (response?.data === undefined) {
        throw new Error('Received invalid response from server.')
      }

      const createdRestaurant = response.data

      onOpenChange()
      console.log('Created restaurant:', createdRestaurant)
    } catch (error) {
      console.error('Error:', error)

      // If error is an instance of Error, use its message, otherwise use the whole error object
      const errorMessage = (error instanceof Error) ? error.message : JSON.stringify(error)

      // Extract and format validation error details for a user-friendly message
      try {
        const errorData = JSON.parse(errorMessage)
        const detailedMessage = errorData.errors.map((err: { path: any, message: any }) => `${err.path.join('.')} ${err.message}`).join('\n')
        toast.error(`Error:\n${detailedMessage}`)
      } catch (parseError) {
        // If parsing or formatting fails, fall back to the original error message
        toast.error(`Error:\n${errorMessage}`)
      }
    }
  }

  return (
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add New Restaurant</ModalHeader>
              <ModalBody>
                <Input
                  width="100%"
                  value={newRestaurant.name}
                  onChange={handleChange}
                  name="name"
                  label="Name"
                  placeholder="Enter restaurant name"
                />
                <Input
                  width="100%"
                  value={newRestaurant.location}
                  onChange={handleChange}
                  name="location"
                  label="Location"
                  placeholder="Enter restaurant location"
                />
                <Input
                  width="100%"
                  value={newRestaurant.image}
                  onChange={handleChange}
                  name="image"
                  label="Image URL"
                  placeholder="Enter image URL"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={() => { void handleSubmit() }}>
                  Add Restaurant
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
  )
}

export default AddRestaurantModal
