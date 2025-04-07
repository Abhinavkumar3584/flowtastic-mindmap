
import { useState } from 'react';
import { useSignIn } from '@clerk/clerk-react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// Check if we have Clerk authentication
const hasClerk = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY && 
                 import.meta.env.VITE_CLERK_PUBLISHABLE_KEY !== "pk_test_placeholder";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Only use Clerk hooks if we have Clerk
  const clerkSignIn = hasClerk ? useSignIn() : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      
      if (hasClerk && clerkSignIn) {
        // Use Clerk authentication if available
        await clerkSignIn.signIn.create({
          identifier: email,
          password,
        });

        if (clerkSignIn.signIn.status === 'complete') {
          toast.success('Login successful');
          navigate('/admin/dashboard');
        }
      } else {
        // In development mode without Clerk, allow any login
        toast.success('Development mode: Login successful');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
            {!hasClerk && (
              <p className="text-xs mt-2 text-amber-600">
                Running in development mode. Any credentials will work.
              </p>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input 
                id="email"
                type="email" 
                placeholder="admin@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input 
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/admin/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
