import React from 'react';
import { Form, Field as FinalFormField } from 'react-final-form';
import { Button, Stack } from 'tamagui';
import Field from '../../modules/Field';

const RegisterForm = ({ formFields }) => {
  const onSubmit = async (values) => {
    // Handle form submission
    console.log(values);
  };

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit }) => (
        <Stack padding="$4" space as="form" onSubmit={handleSubmit}>
          {formFields.map((field, index) => (
            <FinalFormField
              key={index}
              name={field.label.toLowerCase().replace(' ', '_')}
              validate={field.validation === 'required' ? required : undefined}
              render={({ input, meta }) => (
                <Field
                  {...input}
                  label={field.label}
                  type={field.type}
                  validation={field.validation}
                  options={field.options || []}
                  error={meta.touched && meta.error ? meta.error : ''}
                />
              )}
            />
          ))}
          <Button onPress={handleSubmit}>Register</Button>
        </Stack>
      )}
    />
  );
};

// Basic required validation function
const required = (value) => (value ? undefined : 'Required');

export default RegisterForm;
