import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { dateOnly } from '../services/dapit-serivce';

interface Icomments {
    comments: Array<{ personalName: string, content: string, date: Date, _id?: string }>;
    count: number;
    idDapitOrPost: string;
    _id?: string;
}

interface ViewCommentsProps {
    idDapitOrPost: string;
    comments: Icomments[];
}

const ViewComments: React.FC<ViewCommentsProps> = ({ idDapitOrPost, comments }) => {
    const [specificComments, setSpecificComments] = useState<Icomments[]>([]);

    useEffect(() => {
        console.log('ViewComments: ', comments);
        console.log('ViewComments: ', idDapitOrPost);

        const filteredComments = comments.filter(comment => comment.idDapitOrPost === idDapitOrPost);
        setSpecificComments(filteredComments);
        console.log('ViewComments: ', filteredComments);
    }, [comments, idDapitOrPost]);

    const borderCol = () => {
        return { borderLeft: "1px dashed gray" }
    }

    return (
        <div>
            <Row>
                <Col>
                    {specificComments.length > 0 ? specificComments.map((commentGroup: Icomments, index) => (
                        <React.Fragment key={index}>
                            {commentGroup.comments.map((comment, commentIndex) => (
                                <Card key={comment._id || commentIndex}>
                                    <Card.Body>
                                        <Row>
                                            <Col md={2}>
                                                <Row>
                                                    <Card.Text>{dateOnly(comment.date)}</Card.Text>
                                                </Row>
                                            </Col>
                                            <Col md={10} style={{...borderCol()}}>
                                                <Card.Title>{comment.personalName}</Card.Title>
                                                <Card.Text>{comment.content}</Card.Text>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            ))}
                        </React.Fragment>
                    )) : <p>No comments available.</p>}
                </Col>
            </Row>
        </div>
    );
};

export default ViewComments;
