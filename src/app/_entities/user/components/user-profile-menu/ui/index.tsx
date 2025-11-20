import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/_shared/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/_shared/components/ui/avatar';
import { auth, signOut } from '~/server/auth';
import Link from 'next/link';

export async function UserProfileMenu() {
  const session = await auth();

  const handleSignOut = async () => {
    'use server';
    await signOut({ redirectTo: '/' });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={session?.user.image!} />
          <AvatarFallback>{session?.user.name?.charAt(0)}</AvatarFallback>
        </Avatar>

      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}