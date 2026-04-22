
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Pricing() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const plans = [
    {
      title: 'Basic',
      price: '$10/mo',
      features: ['Access to question bank', 'Basic analytics', 'Email support'],
      highlight: false,
    },
    {
      title: 'Pro',
      price: '$25/mo',
      features: ['Everything in Basic', 'AI-powered question generation', 'Advanced analytics', 'Priority support'],
      highlight: true,
    },
    {
      title: 'Enterprise',
      price: '$50/mo',
      features: ['Everything in Pro', 'Custom branding', 'Team management', 'Dedicated account manager'],
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-purple-600 to-indigo-700 flex flex-col items-center justify-start p-8">
      
      {/* Header */}
      <div className="max-w-6xl w-full text-center mb-12" data-aos="fade-down">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Choose Your Plan</h1>
        <p className="text-white/90 text-lg md:text-xl">
          Flexible pricing plans to suit every learner and educator
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl">
        {plans.map((plan, i) => (
          <div
            key={i}
            data-aos="fade-up"
            data-aos-delay={i * 150}
            className={`relative flex flex-col p-8 rounded-3xl shadow-xl transition-all duration-500 transform hover:-translate-y-3 hover:shadow-2xl ${
              plan.highlight 
                ? 'bg-gradient-to-br from-purple-600 to-purple-400 text-white border-2 border-purple-500'
                : 'bg-white/90 text-gray-900'
            } group overflow-hidden`}
          >
            {/* Glow overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-500 opacity-0 group-hover:opacity-20 rounded-3xl transition-all duration-500 pointer-events-none"></div>

            <h2 className="text-2xl font-bold mb-4 z-10 relative">{plan.title}</h2>
            <p className="text-3xl font-extrabold mb-6 z-10 relative">{plan.price}</p>

            <ul className="flex-1 flex flex-col gap-3 mb-6 z-10 relative">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-center gap-3">
                  <span className="text-purple-500 font-bold text-xl">✔️</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`py-3 rounded-lg font-bold transform transition-all duration-300 z-10 relative ${
                plan.highlight
                  ? 'bg-purple-700 hover:bg-purple-800 text-white hover:-translate-y-1 hover:shadow-lg'
                  : 'bg-purple-200 text-purple-700 hover:bg-purple-300 hover:-translate-y-1 hover:shadow-md'
              }`}
            >
              {plan.highlight ? 'Get Started' : 'Choose Plan'}
            </button>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <p className="text-white/80 text-sm mt-12 max-w-2xl text-center" data-aos="fade-up" data-aos-delay={400}>
        All plans come with a 14-day free trial. No credit card required.
      </p>
    </div>
  );
}