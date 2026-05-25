import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
        <EmptyState
          icon={ShieldAlert}
          title="Access Denied"
          description="You don't have permission to access this page. Please contact your administrator if you believe this is a mistake."
          action={
            <Button onClick={() => navigate(-1)} variant="primary">
              Go Back
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default Unauthorized;
