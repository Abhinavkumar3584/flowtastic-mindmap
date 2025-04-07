
import { useState } from 'react';
import { useSignUp } from '@clerk/clerk-react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// Check if we have Clerk authentication
const hasClerk = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY && 
                 import.meta.env.VITE_CLERK_PUBLISHABLE_KEY !== "pk_test_placeholder";

const AdminSignup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Only use Clerk hooks if we have Clerk
  const clerkSignUp = hasClerk ? useSignUp() : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      
      if (hasClerk && clerkSignUp) {
        // Use Clerk authentication if available
        await clerkSignUp.create({
          emailAddress: email,
          password,
          firstName,
          lastName
        });

        // Send email verification
        await clerkSignUp.prepareEmailAddressVerification({
          strategy: 'email_code',
        });
        
        toast.success('Signup successful! Please verify your email.');
      } else {
        // In development mode without Clerk
        toast.success('Development mode: Account created successfully');
      }
      
      navigate('/admin');
    } catch (error) {
      console.error('Error during signup:', error);
      toast.error('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Admin Signup</CardTitle>
          <CardDescription className="text-center">
            Create a new admin account
            {!hasClerk && (
              <p className="text-xs mt-2 text-amber-600">
                Running in development mode. No real account will be created.
              </p>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                <Input 
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                <Input 
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
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
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/admin" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminSignup;
