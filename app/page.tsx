'use client';

import Image from 'next/image';
import Footer from './components/Footer';
import Navigation from './components/Navigation';

export default function Home() {
  return (
    <div>
      <Navigation />
      <main className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/awsf/gateway-endpoints.gif"
              alt="Gateway Endpoints Demo"
              width={800}
              height={450}
              className="rounded-lg shadow-lg"
            />
            <p className="text-gray-600 text-center max-w-2xl">
              This demonstration showcases <span className="font-bold text-[#7647D3]">AWS VPC Gateway Endpoints</span> in action. On a
              regular schedule, the Lambda function inside our private VPC will access an{' '}
              <span className="font-bold text-[#569A31]">S3 bucket</span> that is not publicly accessible, demonstrating how Gateway
              Endpoints enable private access to AWS services without internet exposure.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
