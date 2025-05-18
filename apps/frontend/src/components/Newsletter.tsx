import { useState } from 'react';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { postSubscribe } from '@/api/useNewsletter';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!email.includes('@')) {
      setMsg('');
      setErr('Please enter a valid email');
      return;
    }

    async function exec() {
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
      <div className="text-md">Subscribe to our newsletter</div>
      <div className="text-xs text-gray-500 mt-0.5 mb-2">
        Join other members and get updates on open source trends.
      </div>
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
      {msg && <div className="text-emerald-700 text-xs mt-2">{msg}</div>}
      {err && <div className="text-red-700 text-xs mt-2">{err}</div>}
    </div>
  );
};
