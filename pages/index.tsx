import supabase from '@/utils/supabaseClient'
import {useState} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'

export default function Login() {
    const [email, setEmail] = useState<string | undefined>()
    const [password, setPassword] = useState<string | undefined>()
    const router = useRouter()

    async function signInWithEmail() {
      try {
        if (email && password) {
          const resp = await supabase.auth.signInWithPassword({
            email: email, 
            password: password
          })
          if (resp.error) throw resp.error
          const userId = resp.data.user?.id 
          console.log('resp.data:', resp.data)
          console.log('id:', userId)


          try {
            const {data, error} = await supabase
              .from('users')
              .select('username')
              .eq('id', userId)
            if (error) throw error
            console.log('data:', data)
            console.log('data[0].username:', data[0].username)
            //setAccount(data[0].username)
            router.push('/' + data[0].username)
          } catch (error) {
            console.log('error:', error)
          }

          
        }
      } catch (error) {
        console.log('error:', error)
      }
      
    }

  return (
      <div className='flex flex-col justify-center items-center w-full h-screen'>
        <label 
            htmlFor="email" 
            className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="mt-1">
          <input
            type="email"
            name="email"
            id="email"
            className="block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <label 
            htmlFor="password" 
            className="block text-sm font-medium text-gray-700 mt-4">
          Password
        </label>
        <div className="mt-1">
          <input
            type="password"
            name="password"
            id="password"
            className="block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder=""
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="mt-8 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={signInWithEmail}
        >
          Log In
        </button>
        <Link href='/signUp' className='text-blue-700 mt-10'>Sign Up</Link>

      </div>
    )
  }
  
  
