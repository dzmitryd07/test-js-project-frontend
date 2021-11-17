import React, {useEffect, useState} from "react";
import {Row, Col, Container} from "react-bootstrap";
import FormComponent from "./Components/FormComponent";
import ListComponent from "./Components/ListComponent";

function App() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([],);
    const [status, setStatus] = useState(null);
    const url = process.env.REACT_APP_BACKEND_URL;

    const postData = async (data = {}) => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        };

        fetch(url, requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();
                if (!response.ok) {
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
                if (response.status === 201) {
                    setItems(oldArray => [data, ...oldArray]);
                    setStatus(response);
                }
            })
    }

    useEffect(() => {
        const fetchData = async (data = {}) => {
            fetch(url)
                .then(async response => {
                    const isJson = response.headers.get('content-type')?.includes('application/json');
                    const data = isJson && await response.json();
                    if (!response.ok) {
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    }
                    setItems(data);
                    setIsLoaded(true);
                })
        }

        fetchData();
    }, [url]);

    return (
        <Container fluid>
            <Row className="justify-content-md-center mt-5">
                <Col xs lg="6" md="6">
                    <h1>{process.env.REACT_APP_WEBSITE_NAME}</h1>
                </Col>
            </Row>

            <Row className="justify-content-md-center mt-5">
                <Col xs lg="6" md="6">
                    <FormComponent postData={postData} status={status}/>
                </Col>
            </Row>

            <Row className="justify-content-md-center mt-5">
                <Col xs lg="6" md="6">
                    {!isLoaded &&
                    <div>Loading messages...</div>}
                    <ListComponent items={items}/>
                </Col>
            </Row>
        </Container>
    );
}

export default React.memo(App);