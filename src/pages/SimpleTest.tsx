import { useAuth } from '@/contexts/AuthContext';

const SimpleTest = () => {
  const { user, loading } = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Simple Auth Test</h1>
      <div className="space-y-2">
        <p><strong>Loading:</strong> {loading ? 'True' : 'False'}</p>
        <p><strong>User:</strong> {user ? user.email : 'Not logged in'}</p>
        <p><strong>Status:</strong> AuthContext is working!</p>
      </div>
    </div>
  );
};

export default SimpleTest;