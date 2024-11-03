"use client"
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation';

const ForgotPassword = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [uidb64, setUidb64] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        // Captura os parâmetros da URL
        const uidb64Param = searchParams.get('uidb64');
        const tokenParam = searchParams.get('token');

        if (uidb64Param && tokenParam) {
            setUidb64(uidb64Param);
            setToken(tokenParam);
        }
    }, [searchParams]);

    async function handleConfirmReset(e) {
        e.preventDefault();
        const response = await fetch(`http://127.0.0.1:8000/api/password_reset_confirm/${uidb64}/${token}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ new_password: newPassword }),
        });

        if (response.ok) {
            alert('Senha redefinida com sucesso!');
            router.push('/login'); // Redireciona para a página de login após redefinir a senha
        } else {
            alert('Erro ao redefinir a senha.');
        }
    }
    
    // Mostra uma mensagem de carregamento até que os parâmetros estejam disponíveis
    if (!uidb64 || !token) {
        return <div>Carregando...</div>;
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
                        <p className='text-muted-foreground'>Digite sua nova senha.</p>
                    </div>
                    <form onSubmit={handleConfirmReset} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor='password'>Nova Senha</Label>
                            <Input
                                id='password'
                                type='password'
                                placeholder='Digite sua nova senha'
                                onChange={(e) => setNewPassword(e.target.value)}
                                value={newPassword}
                                required
                            />
                        </div>
                        <Button className='w-full' type='submit'>Enviar</Button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

export default ForgotPassword;
