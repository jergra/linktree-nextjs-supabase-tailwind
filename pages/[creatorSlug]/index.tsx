import supabase from "@/utils/supabaseClient"
import { useEffect, useState } from "react"
import ImageUploading, { ImageListType } from "react-images-uploading"
//import { idText } from "typescript"
import Image from 'next/image'
import {useRouter} from 'next/router'

type Link = {
  title: string
  url: string
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [userId, setUserId] = useState<string | undefined>()
  const [title, setTitle] = useState<string | undefined>()
  const [url, setUrl] = useState<string | undefined>()
  const [links, setLinks] = useState<Link[]>()
  const [images, setImages] = useState<ImageListType>([])
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | undefined>()

  const router = useRouter()
  const {creatorSlug} = router.query

  const onChange = (imageList: ImageListType) => {
    setImages(imageList)
  }

  useEffect(() => {
    const getUser = async () => {
      const user = await supabase.auth.getUser()
      console.log('user:', user)
      try {
        const {data, error} = await supabase
          .from('users')
          .select('id')
          .eq('username', creatorSlug)
        if (error) throw error
        console.log('data1[0]?.id:', data[0]?.id)
        console.log('user.data.user?.id:', user.data.user?.id)
        if (data[0]?.id && user.data.user?.id) {
          if (data[0]?.id === user.data.user?.id) {
            const userId = user.data.user?.id 
            setIsAuthenticated(true)
            setUserId(userId)
            console.log('isAuthenticated:', isAuthenticated)
          } 
        }
      } catch (error) {
        console.log('error:', error)
      }
    }

    getUser()
  }, [creatorSlug])

  useEffect(() => {
    const getLinks = async () => {
      try {
        const {data, error} = await supabase
          .from('links')
          .select('title, url')
          .eq('user_id', userId)
        if (error) throw error
        setLinks(data)
      } catch (error) {
        console.log('error:', error)
      }
    }
    if (userId) {
      getLinks()
    }
  }, [userId])

  useEffect(() => {
    const getUser = async () => {
      try {
        const {data, error} = await supabase
          .from('users')
          .select('id, profile_picture_url')
          .eq('username', creatorSlug)
        if (error) throw error
        const profilePictureUrl = data[0]['profile_picture_url']
        const userId = data[0]['id']
        setProfilePictureUrl(profilePictureUrl)
        setUserId(userId)
      } catch (error) {
        console.log('error:', error)
      }
    }
    if (creatorSlug) {
      getUser()
    }
  }, [creatorSlug])

  const addNewLink = async () => {
    try {
      if (title && url && userId) {
        const {data, error} = await supabase
          .from('links')
          .insert({
            title: title,
            url: url,
            user_id: userId,
        }).select()
        if (error) throw error
        console.log('data:', data)
        if (links) {
          setLinks([...data, ...links])
        }
        setTitle('')
        setUrl('')
      }
    } catch (error) {
      console.log('error:', error)
    }
  }

  const uploadProfilePicture = async () => {
    try {
      if (images.length > 0) {
        const image = images[0]
        if (image.file && userId) {
          const {data, error} = await supabase.storage
            .from('public')
            .upload(`${userId}/${image.file.name}`, image.file, {upsert: true})
            if (error) throw error
            const resp = supabase.storage.from('public').getPublicUrl(data.path)
            const publicUrl = resp.data.publicUrl 
            const updateUserResponse = await supabase
              .from('users')
              .update({profile_picture_url: publicUrl})
              .eq('id', userId)
              if (updateUserResponse.error) throw error
            window.location.reload()
        }
      }
    } catch (error) {
      console.log('error:', error)
    }
  }

  return (
        <div className='flex flex-col justify-center items-center w-full bg-indigo-50'>
          {profilePictureUrl && 
              <Image
                src={profilePictureUrl}
                alt='profile-picture'
                height={100}
                width={100}
                className='mt-20 rounded-full'
              />
          }
          <div className={isAuthenticated ? '' : 'mb-96'}>
          {links?.map((link: Link, index: number) => (
            <div 
                key={index}
                className='cursor-pointer shadow-xl w-96 bg-indigo-500 mt-4 rounded-lg p-4 text-center text-white text-2xl'
                onClick={(e) => {
                  e.preventDefault()
                  //window.location.href = link.url
                  window.open(link.url, '_blank');
                }}
            >
                  {link.title}
            </div>
          ))}
          </div>
          {isAuthenticated && (
            <>
              <div className='mt-10 flex h-10 items-center p-5'>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={title}
                  className="mr-3 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="name of link"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <input
                  type="text"
                  name="url"
                  id="url"
                  value={url}
                  className="mr-3 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="link URL"
                  onChange={(e) => setUrl(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-[300px] inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={addNewLink}
                >
                  Add New Link
                </button>    
              </div>
              
              <div className="mt-14 flex flex-col">
                {images.length > 0 && (
                <Image
                  src={images[0]['data_url']}
                  height={100}
                  width={100}
                  alt='profile-picture'
                />
                )}
                <ImageUploading
                  multiple
                  value={images}
                  onChange={onChange}
                  maxNumber={1}
                  dataURLKey='data_url'
                >
                  {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps
                  }) => (
                    // write your building UI
                    <div className="">
                      <button
                        className='p-10 h-100 w-100 rounded-md border border-gray-300 shadow-sm bg-white'
                        style={isDragging ? { color: "red" } : undefined}
                        onClick={onImageUpload}
                        {...dragProps}
                      >
                        Click or Drop here
                      </button>
                      &nbsp;
                      {/* <button 
                        className='ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                        onClick={onImageRemoveAll}
                      >Remove all images</button> */}
                      {imageList.map((image, index) => (
                        <div key={index} className="image-item">
                          <img src={image.dataURL} alt="" width="100" />
                          <div className="image-item__btn-wrapper">
                            <button 
                              onClick={() => onImageUpdate(index)}
                              className='mr-2'
                            >Update</button>
                            <button onClick={() => onImageRemove(index)}>Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ImageUploading>
                <button
                  type="submit"
                  className="mt-4 mb-96 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={uploadProfilePicture}
                >
                  Upload Profile Picture
                </button>    
              </div>
            </>
          )}
        </div>
  )
}
