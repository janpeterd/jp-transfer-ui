import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import useStore from '@/store/store';
import { Canvas } from '@react-three/fiber';
import { useQueryClient } from '@tanstack/react-query';
import { Link, redirect } from '@tanstack/react-router';
import { LogOut, ShieldCheck, User } from 'lucide-react';
import { useEffect } from 'react';
import Logo3d from './Logo3d';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';

const links = [
  { href: "/", label: "Home", auth: true },
  { href: "/profile", label: "Profile", auth: true }
];
export default function Navbar() {
  const { user, isAuthenticated, setIsAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { role, setRole } = useStore();

  useEffect(() => {
    const token = localStorage.getItem('token');

    setIsAuthenticated(!!token);
    if (user?.role !== role) {
      setRole(user?.role.valueOf() || "USER");
    }
  }, [role, setIsAuthenticated, setRole, user?.role]);

  const handleSignout = async () => {
    localStorage.clear();
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    await queryClient.invalidateQueries({ queryKey: ['loggedinUser'] });
    setRole("");
  };
  const userInitials = user
    ? user.email.substring(0, 2).toUpperCase()
    : '..';

  return (
    <nav className="fixed top-0 z-20 flex w-screen justify-between bg-transparent pt-2 font-elec print:hidden">
      <button
        className="justify-content flex w-auto flex-shrink cursor-pointer items-center rounded-full sm:bg-white/10 pr-4 backdrop-blur backdrop-saturate-150 [view-transition-name:header-left]"
        onClick={() => redirect({ to: '/' })}>
        <div className="-top-10 md:-top-20 absolute -left-12 z-0 h-[180px] w-48">
          <Canvas>
            <Logo3d />
          </Canvas>
        </div>
        <a
          href="/"
          className="text-bold text-red flex-auto p-1 text-center text-xl hover:text-zinc-200">
          <div className="hidden sm:block ml-12 min-w-[150px] pl-8 font-bold">JP Transfer</div>
        </a>
      </button>

      <div className="justify-content m-2 flex-nowrap flex-shrink-0 items-center gap-x-2 rounded-full bg-white/10 px-2 text-white backdrop-blur-lg backdrop-saturate-150 [view-transition-name:header-right] md:flex">
        {links.map((link) => (link.auth === isAuthenticated) && (
          <Link
            key={link.href}
            to={link.href}
            className="group flex-auto p-1 text-center text-xl font-bold transition-all duration-300 ease-in-out hover:text-zinc-200 {classes}"
            activeProps={{ className: 'text-primary' }}>
            <span
              className={`bg-gradient-to-r from-green-500 to-green-500 bg-[length:0%_3px] bg-left-bottom bg-no-repeat transition-all duration-500 ease-out group-hover:bg-[length:100%_3px]`}>
              {link.label}
            </span>
          </Link>
        ))}
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900">
                <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border-2 border-neutral-600 group-hover:border-blue-500 transition-colors">
                  <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-neutral-800 border-neutral-700 text-neutral-100" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.email?.split('@')[0] || "User"}
                  </p>
                  <p className="text-xs leading-none text-neutral-400">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-neutral-700" />
              <DropdownMenuItem className="hover:bg-neutral-700/70 focus:bg-neutral-700/70 cursor-pointer" asChild>
                <Link to="/profile" className="flex items-center w-full">
                  <User className="mr-2 h-4 w-4 text-neutral-400" />
                  Profile
                </Link>
              </DropdownMenuItem>
              {role === 'ADMIN' && (
                <DropdownMenuItem className="hover:bg-neutral-700/70 focus:bg-neutral-700/70 cursor-pointer" asChild>
                  <Link to="/admin" className="flex items-center w-full">
                    <ShieldCheck className="mr-2 h-4 w-4 text-neutral-400" />
                    Admin Panel
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-neutral-700" />
              <Link to="/login">
                <DropdownMenuItem
                  onClick={handleSignout}
                  className="text-red-400 hover:bg-red-500/20 focus:bg-red-500/20 focus:text-red-300 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/login" className="">
            <Button variant="link" className="font-bold text-lg p-1 text-white hover:text-blue-400 hover:bg-blue-500/10 pr-2">
              Log In
            </Button>
          </Link>
        )}
      </div>
    </nav >
  );
}
