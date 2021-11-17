import React from "react";
import {Card} from "react-bootstrap";
import CardHeader from "react-bootstrap/CardHeader";

function ListComponent(props) {
    return (
        <>
            {props.items.map(item => (
                <Card key={item.id} className="mb-2">
                    <CardHeader className="card-header">
                        {item.name}
                    </CardHeader>
                    <Card.Body>
                        {item.message}
                    </Card.Body>
                </Card>
            ))}
        </>
    );
}

export default ListComponent;