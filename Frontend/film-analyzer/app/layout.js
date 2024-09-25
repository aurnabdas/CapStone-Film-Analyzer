'use client'
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';
import './globals.css';
import { Provider } from 'react-redux';
import store from './store/store';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>

          <Provider store={store}>
            {children}
          </Provider>
              
        </body>
      </html>
    </ClerkProvider>
  );
}
