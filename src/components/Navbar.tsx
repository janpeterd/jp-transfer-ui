import { Button } from './ui/button'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { redirect } from '@tanstack/react-router'
import useStore from '@/store/store'

export default function Navbar() {
  const { isAuthenticated, setIsAuthenticated, role, setRole } = useStore()
  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (token) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
    if (role) {
      setRole(role)
    }
  }, [setIsAuthenticated, setRole])

  const handleSignout = async () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    setIsAuthenticated(false)
    redirect({
      to: '/login'
    })
  }

  return (
    <div className="flex w-full items-center justify-between">
      <div>
        <a href={`/`}>
          <img src={`/jp_logo.svg`} alt="logo" width={100} height={100}></img>
        </a>
      </div>
      <div className="flex items-center justify-center space-x-4 text-white">
        <>
          {isAuthenticated ? (
            <div className="flex items-center justify-center gap-x-6">
              <Button variant={'outline'} onClick={handleSignout}>
                Sign out
              </Button>
              {role === 'ADMIN' && (
                <Link to="/admin">
                  <Button variant={'outline'}>Admin</Button>
                </Link>
              )}
              <Link to="/profile">
                <Avatar className="border-2 border-white/20">
                  <AvatarFallback>
                    {localStorage.getItem('email')?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          ) : (
            <Link to="/login">
              <Button variant={'outline'}>Log in</Button>
            </Link>
          )}
        </>
      </div>
    </div>
  )
}
