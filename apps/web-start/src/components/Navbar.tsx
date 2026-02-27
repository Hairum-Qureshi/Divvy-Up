import { useAuth0 } from '@auth0/auth0-react';
import divvyUpLogo from '../../public/DivvyUp-Logo.png';

export default function Navbar() {
  const { isAuthenticated } = useAuth0();
  const { logout } = useAuth0();

  return (
    <nav className="w-full bg-green-700 p-2 text-white font-semibold">
      <div className="mx-10 flex justify-between items-center">
        <div className="text-2xl flex items-center space-x-2">
          <img src={divvyUpLogo} alt="DivvyUp Logo" className="w-10 h-10" />
          <a href="/">DivvyUp</a>
        </div>
        <ul className="flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <li>
                <a href="/profile">Your Profile</a>
              </li>
              <li>
                <a href="/group/create/new">Create a Group</a>
              </li>
              <li>
                <a href="/groups/all">View Groups</a>
              </li>
              <li>
                <a href="/dashboard">Dashboard</a>
              </li>
              <li
                onClick={() => logout({ logoutParams: { returnTo: '/join' } })}
              >
                <a href="/join">Logout</a>
              </li>
            </>
          ) : (
            <li>
              <a href="/join">Join DivvyUp!</a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
