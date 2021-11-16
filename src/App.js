import React, {useEffect, useState} from "react";
import "./App.css";
import {Row, Col, Container} from "react-bootstrap";
import FormComponent from "./Components/FormComponent";
import ListComponent from "./Components/ListComponent";

function App() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([],);
    const [status, setStatus] = useState(null);
    const url = process.env.REACT_APP_BACKEND_URL;

    const loadData = async () => {
        const response = await fetch(url);
        const data = await response.json();
        setIsLoaded(true);
        setItems(data);
    };

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
                if (response.status === 201){
                    setStatus(response.status);
                }
                items.unshift(data);
                setItems(oldArray => [...oldArray, items]);
            })
    }

    useEffect(() => {
        loadData();
    });

    return (
        <Container fluid={"md"}>
            <Row className="justify-content-md-center">
                <h1>{process.env.REACT_APP_WEBSITE_NAME}</h1>
            </Row>

            <Row>
                <Col>
                    <FormComponent postData={postData} status={status}/>
                </Col>
            </Row>

            <Row className="mt-5">
                <Col>
                    {!isLoaded &&
                    <div>Loading messages...</div>}
                    <ListComponent items={items}/>
                </Col>
            </Row>
        </Container>
    );
}

export default App;