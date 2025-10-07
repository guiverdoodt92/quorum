import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PT_BR } from '../../constants/pt-br';
import { Users, Lock } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (err) {
      setError('Falha ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-primary rounded-full shadow-orange-glow-lg mb-4">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-orange-primary mb-2">
            {PT_BR.app.title}
          </h1>
          <p className="text-gray-400">{PT_BR.app.subtitle}</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                {PT_BR.auth.email}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full"
                placeholder="seu-email@exemplo.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                {PT_BR.auth.password}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field w-full pl-10"
                  placeholder="••••••••"
                  required
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? PT_BR.common.loading : PT_BR.auth.login}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-dark-border">
            <p className="text-sm text-gray-400 text-center">
              {PT_BR.auth.selectRole}
            </p>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="text-center p-3 bg-dark-elevated rounded-lg border border-dark-border">
                <p className="text-xs text-gray-400">{PT_BR.auth.president}</p>
              </div>
              <div className="text-center p-3 bg-dark-elevated rounded-lg border border-dark-border">
                <p className="text-xs text-gray-400">{PT_BR.auth.firstCounselor}</p>
              </div>
              <div className="text-center p-3 bg-dark-elevated rounded-lg border border-dark-border">
                <p className="text-xs text-gray-400">{PT_BR.auth.secondCounselor}</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Sistema de Gestão do Quórum de Élderes
        </p>
      </div>
    </div>
  );
}
