import React, { useState } from 'react';
import { Form, Field as FinalFormField } from 'react-final-form';
import { Button, Spinner, Stack } from 'tamagui';
import Field from '../modules/Field';

const RegisterForm = ({ formFields }) => {
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

    return (
        <Form
            onSubmit={onSubmit}
            render={({ handleSubmit }) => (
                <Stack padding="$4" space as="form" onSubmit={handleSubmit}>
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
                    <Button
                        disabled={status === 'submitting'}
                        onPress={handleSubmit}
                        icon={status === 'submitting' ? () => <Spinner /> : undefined}
                    >
                        Submit
                    </Button>
                </Stack>
            )}
        />
    );
};

export default RegisterForm;
