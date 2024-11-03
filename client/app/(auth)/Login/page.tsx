'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff} from 'lucide-react';
import Link from 'next/link';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);  

    async function handleLogin(e) {
        e.preventDefault();

        const response = await fetch('http://127.0.0.1:8000/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if(response.ok) {
            const data = await response.json();
            localStorage.setItem('accessToken', data.access); // Armazena o token de acesso
            localStorage.setItem('refreshToken', data.refresh); // Armazena o token de refresh
            console.log(data.access);
        } else {
            alert('Credenciais inválidas');
            console.log(response);
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
                        <h1 className="text-3xl font-bold tracking-tighter">Bem-vindo</h1>
                        <p className='text-muted-foreground'>Coloque suas credenciais para entrar.</p>
                    </div>
                    <form  onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor='username'>Nome</Label>
                            <Input
                                id='username'
                                type='text'
                                placeholder='Usuario'
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor='password'>Senha</Label>
                            <div className="relative">
                                <Input
                                    id='password'
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    placeholder='********'
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                                >
                                    {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox id='remember' />
                                <Label htmlFor='remember'>Mantenha-me conectado</Label>
                            </div>
                            <a href="#" className='text-sm font-medium text-primary-600 hover:text-primary-500'>
                                Esqueceu a senha?
                            </a>
                        </div>
                        <Button className='w-full mt-6' type='submit'>
                            Entrar
                        </Button>
                    </form>
                    <div className='flex items-center justify-center'>
                        <Link href="/Register" className='w-full'>
                            <Button className='w-full' variant={'ghost'}>
                                Cadastrar
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

