import { CloudRain, Calendar, LineChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 text-center px-4">
        <h1 className="text-5xl font-extrabold mb-4">Welcome to RideWise</h1>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
          Predicting Bike-Sharing Demand Based on Weather Conditions
        </p>
      </div>

      {/* Feature Cards Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">

        <FeatureCard
          icon={<CloudRain className="h-10 w-10 text-blue-500" />}
          title="Weather-Based Predictions"
          desc="Our AI models analyze weather conditions including temperature, humidity, and wind speed to forecast bike rental demand accurately."
        />

        <FeatureCard
          icon={<Calendar className="h-10 w-10 text-indigo-500" />}
          title="Daily & Hourly Forecasts"
          desc="Get predictions for both daily planning and hourly operational decisions to optimize fleet management and resource allocation."
        />

        <FeatureCard
          icon={<LineChart className="h-10 w-10 text-purple-500" />}
          title="Historical Data Analysis"
          desc="Leverage insights from historical patterns including seasonal trends, working days, and holidays for better demand forecasting."
        />
      </div>

      {/* CTA Section */}
      <div className="text-center pb-20">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Get Started</h3>
        <p className="text-gray-600 mb-8">Create an account or login to start making predictions!</p>
        <div className="space-x-4">
          <Link to="/predict" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md">
            Make a Prediction
          </Link>
          <Link to="/dashboard" className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition shadow-md">
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300">
    <div className="mb-4 bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed text-sm">{desc}</p>
  </div>
);

export default Home;
