import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Input, Label, Select, Stack, YStack } from 'tamagui';
import RegisterForm from './Registerform';
import BottomDialog from './MBottomDailog';
import { Form, Field as FinalFormField } from 'react-final-form';
import Field from '../modules/Field';

const Addresses = () => {
  const [form, setForm] = useState({
    address1: '',
    address2: '',
    city: '',
    postCode: '',
    country: 'Saudi Arabia',
    region: '',
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  const [status, setStatus] = useState('idle');

  const onSubmit = async (values) => {
      setStatus('submitting');
      console.log(values);
      setTimeout(() => {
          setStatus('idle');
          alert('Form submitted successfully!');
      }, 2000);
  };

  const validateField = (validation) => (value) => {
      if (validation === 'required') {
          return value ? undefined : 'Required';
      }
      return undefined;
  };
    
    
  const formFields = [
    { label: 'Address 1', type: 'text', placeholder: 'Address 1', validation: 'required' },
    { label: 'Address 2', type: 'text', placeholder: 'Address 2', validation: 'optional' },
    { label: 'City', type: 'text', placeholder: 'City', validation: 'required' },
    { label: 'Post Code', type: 'text', placeholder: 'Post Code', validation: 'required' },
    {
      label: 'Country',
      type: 'selectbox',
      options: [
        { label: 'Saudi Arabia', value: 'saudi_arabia' },
        { label: 'United States', value: 'united_states' },
        { label: 'United Kingdom', value: 'united_kingdom' },
        { label: 'India', value: 'india' },
      ],
      validation: 'required',
    },
    {
      label: 'Region / State',
      type: 'selectbox',
      options: [
        { label: 'Riyadh', value: 'riyadh' },
        { label: 'Mecca', value: 'mecca' },
        { label: 'Medina', value: 'medina' },
        { label: 'Jeddah', value: 'jeddah' },
      ],
      validation: 'required',
    },
    // {
    //   label: 'My delivery and billing addresses are the same',
    //   type: 'checkbox',
    //   validation: 'optional',
    // },
  ];
  
    
  return (
    <BottomDialog
        title="Add Address"
        dialogTitle="Add Address"
        children={
            <Form
                onSubmit={onSubmit}
                render={({ handleSubmit }) => (
                    <Stack as="form" onSubmit={handleSubmit}>
                        {formFields.map((field, index) => (
                            <FinalFormField
                                key={index}
                                name={field.label.toLowerCase().replace(' ', '_')}
                                validate={validateField(field.validation)}
                                render={({ input, meta }) => (
                                    <Field
                                        input={input}
                                        label={field.label}
                                        type={field.type}
                                        options={field.options || []}
                                        error={meta.touched && meta.error ? meta.error : ''}
                                    />
                                )}
                            />
                        ))}
                    </Stack>
                )}
            />
        }
        buttons={[
        {
            label: 'Cancel',
            onPress: () => {
                console.log('Cancel Button Pressed');
                //closeDialog();
            },
        },
        {
            label: 'Save',
            onPress: () => console.log('Save Button Pressed'),
        },
        ]}
    />
  );
};

export default Addresses;
