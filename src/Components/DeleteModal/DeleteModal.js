import React from 'react'
import { Modal, Box, Title, Button, Group } from '@mantine/core'

// import { deleteMerchant, deleteProduct } from '../../api/request'

function DeleteModal({ type, open, setOpen, handleDelete }) {
  return (
    <Modal
        opened={open}
        size="lg"
        onClose={() => setOpen(false)}
        centered
    >
        <Title align='center'>Do you want to delete {type}?</Title>

        <Group my="xl" spacing="lg" position="center">
            <Button onClick={()=>handleDelete()} variant='outline' w={100} fz={20} color="green">Yes</Button>
              <Button onClick={() => setOpen(false)} variant='outline' w={100} fz={20} color="indigo">Cancel</Button>
        </Group>

    </Modal>
  )
}

export default DeleteModal