import { Modal, ModalHeader, ModalBody } from "reactstrap"

export default function PostModal(props){

    const displayModal = () => {
        return(
           // PostModal personalPostID currentPersonalPostID

            <Modal
                isOpen = {isModalVisible}
                toggle = {changeModalVisibility}
                style={{
                left: 0,
                top: 100
            }}
            >
                <ModalBody style={{overflowY: "scroll"}}>
                    <PersonalPostEditor personalPost={personalPost}/>
                </ModalBody>
            </Modal>
        )                         
    }

    return (
        <>
            {displayModal(props)}
        </>
    )

}