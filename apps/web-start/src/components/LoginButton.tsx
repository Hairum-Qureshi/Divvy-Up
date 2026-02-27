import { useAuth0 } from '@auth0/auth0-react';

export default function LoginButton() {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      onClick={() =>
        loginWithRedirect({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            prompt: 'consent',
            scope: 'openid profile email',
          },
        })
      }
      className="bg-green-500 p-2 w-1/5 my-5 text-white rounded-md hover:bg-green-600 transition-colors hover:cursor-pointer"
    >
      Log In
    </button>
  );
}
