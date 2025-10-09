import React from 'react';

const SpinnerLoader = () => {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-cyan-900"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.59C100 77.61 77.61 100 50 100C22.39 100 0 77.61 0 50C0 22.39 22.39 0 50 0C77.61 0 100 22.39 100 50Z"
          fill="currentColor"
        />
        <path
          d="M93.97 39.04C96.39 38.4 97.86 35.91 97.01 33.55C95.29 28.82 92.87 24.37 89.81 20.35C85.84 15.11 80.88 10.72 75.21 7.41C69.54 4.10 63.27 1.94 56.77 1.05C51.76 0.36 46.69 5.54 40.04 10.77C44.99 14.32 49.99 17.58 55.04 20.52C60.08 23.47 65.24 26.09 70.63 28.27C75.27 30.26 79.33 32.91 82.58 35.84C84.91 38.21 86.80 41.29 88.18 44.87C89.08 47.21 91.54 48.68 93.97 39.04Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default SpinnerLoader;
