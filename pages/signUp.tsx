import supabase from '@/utils/supabaseClient'
import {useState} from 'react'

export default function SignUp() {
    const [email, setEmail] = useState<string | undefined>()
    const [password, setPassword] = useState<string | undefined>()
    const [username, setUsername] = useState<string | undefined>()

    async function signUpWithEmail() {
      try {
        if (email && password) {
          const resp = await supabase.auth.signUp({
            email: email, 
            password: password
          })
          if (resp.error) throw resp.error
          const userId = resp.data.user?.id
          if (userId) {
            await createUser(userId)
            console.log('userId:', userId)
          }
          alert('Please confirm your email address by clicking the link in the email that has been sent.')
        }
      } catch (error) {
        console.log('error:', error)
      }
    }

    async function createUser(userId: string) {
      try {
        const {error} = await supabase
          .from('users')
          .insert({id: userId, username: username})
        if (error) throw error
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
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <label 
            htmlFor="username" 
            className="block text-sm font-medium text-gray-700 mt-4">
          Username
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="username"
            id="username"
            className="block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="mt-8 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={signUpWithEmail}
        >
          Sign Up
        </button>    
      </div>
    )
  }
  
  
