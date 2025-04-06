
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Welcome to Exam Navigator</h1>
      
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-700 mb-6">
          Browse through various competitive exam categories and learn about their sub-exams. 
          This tool helps you navigate the complex landscape of competitive examinations in India.
        </p>
        
        <div className="flex justify-center">
          <Link to="/exams">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6">
              Explore Exam Categories
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
