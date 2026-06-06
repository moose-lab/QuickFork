import { LogOut, UserRound } from "lucide-react";

import { authClient, useSession } from "../../lib/auth-client";

export function UserMenu() {
  const { data: session, refetch } = useSession();
  const user = session?.user;

  async function signOut() {
    await authClient.signOut();
    await refetch();
  }

  if (user) {
    return (
      <div className="userMenu" aria-label="Signed in user">
        {user.image ? (
          <img className="userAvatar" src={user.image} alt="" />
        ) : (
          <span className="userAvatar" aria-hidden="true">
            <UserRound size={16} />
          </span>
        )}
        <span className="userIdentity">
          <span>{user.name || "QuickFork user"}</span>
          <small>{user.email}</small>
        </span>
        <button className="iconButton" type="button" onClick={signOut} aria-label="Sign out">
          <LogOut size={16} aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div className="authLinks" aria-label="Account">
      <a href="/sign-in">Sign in</a>
      <a className="accountCta" href="/sign-up">
        Sign up
      </a>
    </div>
  );
}
