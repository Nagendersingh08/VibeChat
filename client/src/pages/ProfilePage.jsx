import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import assets from '../assets/assets'
import { AuthContext } from '../context/AuthContextValue'

const ProfilePage = () => {

  const {authUser, updateProfile} = useContext(AuthContext)

  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName)
  const [bio, setBio] = useState(authUser.bio)
  const [email, setEmail] = useState(authUser.email)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = async (e)=>{
    e.preventDefault();

    if(newPassword && newPassword !== confirmPassword){
      toast.error("New passwords do not match");
      return;
    }

    const profileBody = {
      fullName: name,
      bio,
      email,
      newPassword,
    };

    if(!selectedImg){
      const isUpdated = await updateProfile(profileBody);
      if(isUpdated) navigate('/');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async ()=>{
      const base64Image = reader.result;
      const isUpdated = await updateProfile({...profileBody, profilePic: base64Image});
      if(isUpdated) navigate('/');
    }
    
  }


  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg'>Profile details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input onChange={(e)=>setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />
          <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="" className={`w-12 h-12 ${selectedImg && 'rounded-full'}`} />
          Upload Profile Image
          </label>

          <input onChange={(e)=>setName(e.target.value)} value={name}
           type="text" required placeholder='Your name' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' />

           <textarea onChange={(e)=>setBio(e.target.value)} value={bio} placeholder="Write profile bio" required className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500" rows={4}></textarea>

           <h3 className='text-lg'>Account details</h3>

           <input onChange={(e)=>setEmail(e.target.value)} value={email}
           type="email" required placeholder='Email address' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' />

           <input onChange={(e)=>setNewPassword(e.target.value)} value={newPassword}
           type="password" minLength={6} placeholder='New password' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' />

           <input onChange={(e)=>setConfirmPassword(e.target.value)} value={confirmPassword}
           type="password" minLength={6} placeholder='Confirm new password' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' />

           <button type="submit" className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer">Save</button>
        </form>
        <img className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg && 'rounded-full'}`} src={authUser?.profilePic || assets.logo_icon} alt="" />
      </div>
    </div>
  )
}

export default ProfilePage
