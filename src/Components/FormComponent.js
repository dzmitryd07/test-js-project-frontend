import {Button, Form} from "react-bootstrap";
import React, {useState, useEffect, useRef} from "react";

function FormComponent(props) {

    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});
    const textarea = useRef(null);

    const setField = (field, value) => {
        setForm({
            ...form,
            [field]: value
        })

        if (!!errors[field]) setErrors({
            ...errors,
            [field]: null
        })
    }

    const findFormErrors = () => {
        const {name, message} = form
        const newErrors = {}
        let nameValidator = /^[a-zA-Z0-9_]+$/gi;
        let messageValidator = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
        if (!name || name === '') newErrors.name = 'The field cannot be blank'
        else if (!nameValidator.test(name)) newErrors.name = 'The field cannot contain only latin letters, numbers and underscore symbol'
        if (!message || message === '') newErrors.message = 'The field cannot be blank'
        else if (message.match(messageValidator)) newErrors.message = 'The field cannot not contain hypelinks'
        return newErrors
    }

    useEffect(() => {
        function onKeyup(e) {
            if (e.keyCode === 13 && e.ctrlKey) {
                document.getElementById('submitButton').click();
            }
        }

        window.addEventListener('keyup', onKeyup);
    }, []);

    const handleSubmit = e => {
        e.preventDefault()
        const newErrors = findFormErrors()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
        } else {
            props.postData({'name': form.name, 'message': form.message});
        }
    }

    useEffect(() => {
        if (props.status != null && props.status.status === 201) {
            console.log('Message succesfully created', props.status.status);
            textarea.current.value = '';
            setForm({
                ...form,
                'message': ''
            })
        } else if (props.status != null) {
            console.log(props.status);
        }
    }, [props.status]);

    return (
        <>
            <Form noValidate>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control required
                                  type="text"
                                  name="name"
                                  onChange={e => setField('name', e.target.value)}
                                  isInvalid={!!errors.name}
                                  placeholder="Enter your name"/>
                    <Form.Control.Feedback type='invalid'>
                        {errors.name}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control required as="textarea"
                                  rows={3}
                                  name="message"
                                  onChange={e => setField('message', e.target.value)}
                                  isInvalid={!!errors.message}
                                  ref={textarea}
                                  placeholder="Please leave your message here"/>
                    <Form.Control.Feedback type='invalid'>
                        {errors.message}
                    </Form.Control.Feedback>
                </Form.Group>
                <Button onClick={handleSubmit} className="mb-2" id="submitButton">
                    Send
                </Button>
            </Form>
        </>
    );
}

export default React.memo(FormComponent);