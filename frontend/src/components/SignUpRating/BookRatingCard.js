import {Card, CardBody, CardImg} from 'reactstrap'
import Rater from 'react-rater'


export default function BookRatingCard(props){
    const bookId = props.bookId
    const bookTitle = props.bookTitle
    const bookAuthor = props.bookAuthor
    const bookImage = props.bookImage
    const bookRating = 0

    return(
        <Card>
            <CardImg
                src={bookImage}
                top
                width="100%"
                />

            <CardBody>
                <CardTitle>
                  {bookTitle}
                </CardTitle>

                <CardSubtitle
                className="mb-2 text-muted"
                tag="h6"
                >
                    {bookAuthor}
                </CardSubtitle>
                <Rater total={10} rating={0}/>

            </CardBody>
        </Card>
    );

}