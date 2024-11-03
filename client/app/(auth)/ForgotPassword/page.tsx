"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

const ForgotPassword = () => {
    const [email, setEmail] = useState('')

    async function handlePasswordReset(e){
        e.preventDefault();
        const response = await fetch('http://127.0.0.1:8000/api/password_reset/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if(response.ok) {
            const data = await response.json();
            console.log(data);
            alert('Um link de redefinição de senha foi enviado para o seu email.');
        }else {
            alert('Erro ao enviar email de redefinição de senha.');
        }
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-primary-50 to-primary-100 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-bold tracking-tighter">Recuperação de Senha</h1>
                            <p className='text-muted-foreground'>Digite seu email para recuperar sua senha.</p>
                        </div>
                        <form onSubmit={handlePasswordReset} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor='email'>Email</Label>
                                <Input
                                    id='email'
                                    type='email'
                                    placeholder='Email'
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    required
                                />
                            </div>
                            <Button className='w-full' type='submit'>Enviar</Button>
                        </form>
                    </div>
                </motion.div>
            </div>
  )
}

export default ForgotPassword