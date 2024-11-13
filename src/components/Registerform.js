import React, { useState } from 'react';
import { Form, Field as FinalFormField } from 'react-final-form';
import { Button, Spinner, Stack } from 'tamagui';
import Field from '../modules/Field';

const RegisterForm = ({ formFields }) => {
    const [status, setStatus] = useState('idle');
    const onSubmit = async (values) => {
        setStatus('submitting');
        setTimeout(() => {
            setStatus('idle');
        }, 2000);
    console.log(values);  // Should log the form values now
  };
    
  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit }) => (
        <Stack padding="$4" space as="form" onSubmit={handleSubmit}>
          {formFields?.map((field, index) => (
            <FinalFormField
              key={index}
              name={field.label.toLowerCase().replace(' ', '_')}
              validate={field.validation === 'required' ? required : undefined}
              render={({ input, meta }) => (
                <Field
                  input={input}        // Pass input props to Field
                  label={field.label}
                  type={field.type}
                  options={field.options || []}
                  error={meta.touched && meta.error ? meta.error : ''}
                />
              )}
            />
          ))}
            <Button onPress={handleSubmit} icon={status === 'submitting' ? () => <Spinner /> : undefined}>
                Submit
            </Button>
          {/* <Button  onPress={handleSubmit}>Register</Button> */}
        </Stack>
      )}
    />
  );
};

// Basic required validation function
const required = (value) => (value ? undefined : 'Required');

export default RegisterForm;
