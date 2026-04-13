'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { signUp } from '@/lib/api';
import { validateEmail } from '@/lib/utils';
import { ArrowRight, CheckCircle2, UserPlus, Sparkles } from 'lucide-react';

export default function SignUpPage() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword || !name) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, name);
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-gray-100">
      <div className="w-full max-w-md animate-welcome">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-200">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white shadow-lg mb-4">
              <UserPlus className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Your Account</h2>
            <p className="text-gray-600">Join us to boost your productivity</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Verify password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              fullWidth
              className="h-12 rounded-lg text-md font-semibold shadow-md hover:shadow-lg transition-shadow mt-2"
            >
              Create Account
              {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/auth/sign-in"
                className="text-blue-600 font-semibold hover:underline underline-offset-4"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
