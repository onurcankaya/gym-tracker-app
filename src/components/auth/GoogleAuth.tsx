import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function GoogleAuth() {
  return (
    <>
      <div className="flex justify-center text-xs uppercase">
        <span className="text-muted-foreground">Or continue with</span>
      </div>

      <Button
        variant="outline"
        onClick={() => signIn('google', { callbackUrl: '/', redirect: true })}
        className="w-full py-4"
      >
        <img src="/google.svg" alt="google logo" className="w-4 h-4" />
        Continue with Google
      </Button>
    </>
  );
}
