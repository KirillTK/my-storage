import { UserProfileMenu } from '~/entities/user/components/user-profile-menu/ui';
import { Button } from '~/shared/components/ui/button';
import { auth, signIn } from '~/server/auth';


export async function SignInButton() {
  const session = await auth();

  const handleSignIn = async () => {
    'use server';
    await signIn('google', { redirectTo: '/dashboard' });
  }

  return (
    <>
      {session ? (
        <UserProfileMenu />
      ) : (
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-gray-600 hover:text-emerald-600" onClick={handleSignIn}>
            Login
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6" onClick={handleSignIn}>Sign Up</Button>
        </div>
      )}
    </>
  )
}