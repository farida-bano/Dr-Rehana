import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">🍲</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MaaKiRasoi</h1>
          <p className="text-gray-600">Create your account</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <SignUp
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-none border-0',
                formButtonPrimary:
                  'bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg',
                formFieldInput:
                  'border-gray-300 focus:ring-orange-500 focus:border-orange-500',
                dividerLine: 'bg-gray-200',
                dividerText: 'text-gray-600',
                socialButtonsBlockButton:
                  'border-gray-300 hover:bg-gray-50',
                socialButtonsBlockButtonText: 'text-gray-700',
                footerActionLink: 'text-orange-600 hover:text-orange-700',
              },
            }}
          />
        </div>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <a href="/sign-in" className="text-orange-600 font-semibold hover:text-orange-700">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
