import {Row, Col} from "reactstrap";
import {BookLine} from "../UserProfileElements";
import ReactStars from "react-stars";
import {useNavigate} from "react-router";

export default function SingleBookRating(props) {

    const navigate = useNavigate();

    const navigateToBook = (e) => {
        navigate(`/book_profile/${props.book.book__ISBN}`);
    };

    return (
        <div>
            <BookLine>
                <Row style={{height: "5rem"}} onClick={navigateToBook}>
                    <Col xs="2">
                        <img
                            src={props.book.book__image_links_small}
                            alt="Book's cover"
                            style={{height: "5rem", width: "5rem"}}
                        />
                    </Col>

          <Col
            xs="6"
            style={{
              height: "5rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "15px",
            }}
          >
            {props.book.book__title}
          </Col>
          <Col xs="3" style={{ display: "flex", justifyContent: "flex-end" }} data-testid={"rating"}>
            <ReactStars
              count={5}
              edit={false}
              value={props.book.rating / 2}
              size={21}
              color2={"#ffd700"}
            />
          </Col>
        </Row>
      </BookLine>
    </div>
  );
}
