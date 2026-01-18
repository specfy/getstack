import { useState } from 'react';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { postSubscribe } from '@/api/useNewsletter';

export const Newsletter: React.FC<{ title?: string }> = ({ title }) => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!email.includes('@')) {
      setMsg('');
      setErr('Please enter a valid email');
      return;
    }

    async function exec(): Promise<void> {
      try {
        const res = await postSubscribe({ email });
        setErr('');
        setMsg(res.message);
      } catch {
        setMsg('');
        setErr('An error occurred');
      }
    }
    void exec();
  };

  return (
    <div>
      <div>{title ?? 'Subscribe to our newsletter'}</div>
      <div className="mb-2 mt-0.5 text-xs text-gray-500">
        Join other members and get updates on open source trends.
      </div>
      {!msg && (
        <form onSubmit={onSubmit} className="flex gap-2">
          <Input
            placeholder="Enter your email"
            className="h-8"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button size={'sm'} className="text-xs" type="submit">
            Subscribe
          </Button>
        </form>
      )}
      {msg && <div className="mt-2 text-xs text-emerald-700">{msg}</div>}
      {err && <div className="mt-2 text-xs text-red-700">{err}</div>}
    </div>
  );
};
