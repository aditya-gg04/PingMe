import React from 'react';

const Avatar = ({ username, firstname, lastname, online }) => {

  const colors = ['bg-blue-300', 'bg-yellow-300', 'bg-green-300', 'bg-red-300', 'bg-purple-300', 'bg-teal-300']
  function hashStringToNumber(str) {
    let hash = 0;
    if (str) {
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return hash;
    }
  }
  function getColorForUsername(username) {
    
    const hash = hashStringToNumber(username);
    const colorIndex = Math.abs(hash) % colors.length;
    return colors[colorIndex];
  }
  return (
    <div>
      <div className={`relative shadow-lg w-12 h-12 rounded-full  flex items-center justify-center opacity-80 ${getColorForUsername(firstname)}`} >
        {firstname ? firstname[0].toUpperCase() : 'U'}
        {(online && <div className='absolute w-3.5 h-3.5 bg-green-500 bottom-0 right-0 rounded-full border border-white shadow-lg'>

        </div>)}
        {(!online && <div className='absolute w-3.5 h-3.5 bg-gray-500 bottom-0 right-0 rounded-full border border-white shadow-lg'>
        </div>)}

      </div>

    </div>
  );
}

export default Avatar;
