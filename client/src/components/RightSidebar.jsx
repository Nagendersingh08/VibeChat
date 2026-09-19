import { useContext, useState } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../context/ChatContextValue'
import { AuthContext } from '../context/AuthContextValue'
import ConfirmDialog from './ConfirmDialog'

const RightSidebar = () => {

  const {selectedUser, messages, deleteConversation, deleteFriend} = useContext(ChatContext)
  const {logout, onlineUsers} = useContext(AuthContext)
  const msgImages = messages.filter(msg => msg.image).map(msg=>msg.image)
  const [openMenuUserId, setOpenMenuUserId] = useState(null)
  const [confirmAction, setConfirmAction] = useState(null)
  const isMenuOpen = openMenuUserId === selectedUser?._id
  const isSelectedUserOnline = onlineUsers.includes(selectedUser?._id?.toString())

  const handleDeleteChat = () =>{
    setOpenMenuUserId(null)
    setConfirmAction({ type: 'chat', user: selectedUser })
  }

  const handleDeleteFriend = () =>{
    setOpenMenuUserId(null)
    setConfirmAction({ type: 'friend', user: selectedUser })
  }

  const handleConfirmDelete = () =>{
    if(confirmAction?.type === 'chat'){
      deleteConversation()
    }

    if(confirmAction?.type === 'friend'){
      deleteFriend(confirmAction.user._id)
    }

    setConfirmAction(null)
  }

  return selectedUser && (
    <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${selectedUser ? "max-md:hidden" : ""}`}>
      <div className='absolute top-4 right-4 z-30'>
        <button
          type='button'
          onClick={()=> setOpenMenuUserId((prev)=> prev === selectedUser._id ? null : selectedUser._id)}
          className='h-9 w-9 flex items-center justify-center rounded-full text-2xl leading-none hover:bg-white/10 cursor-pointer'
          aria-label='Chat options'
        >
          &#8942;
        </button>
        {isMenuOpen && (
          <div className='absolute top-10 right-0 w-40 rounded-md border border-gray-600 bg-[#282142] p-2 text-sm shadow-lg'>
            <button onClick={handleDeleteChat} className='w-full text-left px-3 py-2 rounded text-red-200 hover:bg-red-500/10 cursor-pointer'>
              Delete Chat
            </button>
            <button onClick={handleDeleteFriend} className='w-full text-left px-3 py-2 rounded text-red-200 hover:bg-red-500/10 cursor-pointer'>
              Delete Friend
            </button>
          </div>
        )}
      </div>

      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-20 aspect-[1/1] rounded-full' />
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
          {isSelectedUserOnline && <p className='w-2 h-2 rounded-full bg-green-500'></p>}
          {selectedUser.fullName}
        </h1>
        <p className={isSelectedUserOnline ? 'text-green-400' : 'text-neutral-400'}>
          {isSelectedUserOnline ? 'Online' : 'Offline'}
        </p>
        <p className='px-10 mx-auto'>{selectedUser.bio}</p>
      </div>

      <hr className="border-[#ffffff50] my-4" />

      <div className="px-5 text-xs">
        <p>Media</p>
        <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
          {msgImages.map((url, index)=>(
            <div key={index} onClick={()=> window.open(url)} className='cursor-pointer rounded'>
              <img src={url} alt="" className='h-full rounded-md' />
            </div>
          ))}

        </div>
      </div>

      <button onClick={()=> logout()} className='absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer'>
        Logout
      </button>

      <ConfirmDialog
        isOpen={Boolean(confirmAction)}
        title={confirmAction?.type === 'chat' ? 'Delete chat?' : 'Delete friend?'}
        message={
          confirmAction?.type === 'chat'
            ? `Delete all messages with ${confirmAction.user.fullName}?`
            : `Remove ${confirmAction?.user.fullName} from your chat list?`
        }
        confirmLabel={confirmAction?.type === 'chat' ? 'Delete Chat' : 'Delete Friend'}
        onCancel={()=> setConfirmAction(null)}
        onConfirm={handleConfirmDelete}
      />

    </div>
  )
}

export default RightSidebar
