import React, { useState } from 'react';

export default function Create() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Handle form submission logic here
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                value={form.name} 
                onChange={(e) => setForm({...form, name: e.target.value})} 
                placeholder="Name" 
            />
            <input 
                type="email" 
                value={form.email} 
                onChange={(e) => setForm({...form, email: e.target.value})} 
                placeholder="Email" 
            />
            <input 
                type="password" 
                value={form.password} 
                onChange={(e) => setForm({...form, password: e.target.value})} 
                placeholder="Password" 
            />
            <input 
                type="password" 
                value={form.password_confirmation} 
                onChange={(e) => setForm({...form, password_confirmation: e.target.value})} 
                placeholder="Confirm Password" 
            />
            <button type="submit">Create User</button>
        </form>
    );
}
