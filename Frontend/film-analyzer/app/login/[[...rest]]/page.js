// app/login/page.js
import { SignIn } from '@clerk/nextjs'; // Updated import

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-curtain">
      <div className="bg-gray-800 bg-opacity-75 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-gold text-3xl mb-6 text-center">Login</h2>
        <SignIn
          path="/login"
          routing="path"
          signUpUrl="/signup"
          appearance={{
            elements: {
              rootBox: 'space-y-4',
              formButtonPrimary: 'bg-red-theme text-white py-2 px-4 rounded w-full',
              formFieldInput: 'bg-gray-200 text-black rounded w-full px-3 py-2',
              footer: 'flex flex-col items-center',
              formDividerText: 'my-4',
            },
          }}
          redirectUrl="/"
        />
      </div>
    </div>
  );
}
