import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '../api/auth';
import { useAuth } from '../store/AuthContext';

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError('');
    try {
      const res = await authApi.login(data);
      login(res.user, res.accessToken);
      navigate('/');
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-group">
            <label>Username</label>
            <input {...register('username')} placeholder="johndoe" />
            {errors.username && <span className="error">{errors.username.message}</span>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input {...register('password')} type="password" placeholder="••••••" />
            {errors.password && <span className="error">{errors.password.message}</span>}
          </div>
          {serverError && <div className="alert alert-error">{serverError}</div>}
          <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
