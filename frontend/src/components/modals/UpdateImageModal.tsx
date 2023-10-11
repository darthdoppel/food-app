// UpdateImageModal.tsx
import React, { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react'

interface UpdateImageModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onUpdateImage: (newImageUrl: string) => void | Promise<void>
}

const UpdateImageModal: React.FC<UpdateImageModalProps> = ({ isOpen, onOpenChange, onUpdateImage }) => {
  const [newImageUrl, setNewImageUrl] = useState('')

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Update Image</ModalHeader>
            <ModalBody>
              <Input
                width="100%"
                placeholder="Enter new image URL"
                value={newImageUrl}
                onChange={(e) => { setNewImageUrl(e.target.value) }}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="default" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  void onUpdateImage(newImageUrl)
                  setNewImageUrl('') // Clear the input
                  onClose() // Close the modal
                }}
              >
                Update Image
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default UpdateImageModal
