import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

import { createUser } from '../utils/API';
import Auth from '../utils/auth';

const SignupForm = () => {
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });

    // Check password strength
    const password = event.target.value;
    let strength = '';

    if (password.length > 0) {
      if (/[a-z]/.test(password)) {
        strength += 'Lowercase ';
      }
      if (/[A-Z]/.test(password)) {
        strength += 'Uppercase ';
      }
      if (/[0-9]/.test(password)) {
        strength += 'Number ';
      }
      if (/[!@#$%^&*]/.test(password)) {
        strength += 'Special Character ';
      }
    }

    setPasswordStrength(strength.trim());
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    setValidated(true);

    try {
      const response = await createUser(userFormData);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { token, user } = await response.json();
      console.log(user);
      Auth.login(token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setUserFormData({ username: '', email: '', password: '' });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your signup!
        </Alert>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <div className='input-group'>
            <div className='input-group-prepend'>
              <span className='input-group-text'>
                <FontAwesomeIcon icon={faUser} />
              </span>
            </div>
            <Form.Control
              type='text'
              placeholder='Your username'
              name='username'
              onChange={handleInputChange}
              value={userFormData.username}
              required
            />
            <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
          </div>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <div className='input-group'>
            <div className='input-group-prepend'>
              <span className='input-group-text'>
                <FontAwesomeIcon icon={faUser} />
              </span>
            </div>
            <Form.Control
              type='email'
              placeholder='Your email address'
              name='email'
              onChange={handleInputChange}
              value={userFormData.email}
              required
            />
            <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
          </div>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <div className='input-group'>
            <div className='input-group-prepend'>
              <span className='input-group-text'>
                <FontAwesomeIcon icon={faLock} />
              </span>
            </div>
            <Form.Control
              type='password'
              placeholder='Your password'
              name='password'
              onChange={handleInputChange}
              value={userFormData.password}
              required
              pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)'
              minLength={8}
            />
            <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
          </div>
          {passwordStrength && (
            <div className='password-strength'>
              Password Strength: {passwordStrength}
            </div>
          )}
        </Form.Group>

        <Button
          disabled={!(userFormData.username && userFormData.email && userFormData.password)}
          type='submit'
          variant='success'
          className='btn-block mt-4'
        >
          Sign Up
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;
