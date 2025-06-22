import React from "react";

function UserPhoto({ imageUrl, name }) {
  return (
    <div className="flex flex-col justify-center items-center px-20 py-12 h-[358px] w-[520px] rounded-xl bg-[#1D1D1F] max-md:px-5 max-md:mt-3 max-md:max-w-full">
      <div className="flex flex-col items-center w-auto">
        {/* Profile Image */}
        <div className="flex overflow-hidden items-center justify-center border-solid aspect-square bg-stone-300 border-[5.611px] border-[color:var(--Linear-color,#EB25C6)] rounded-full w-[202px] h-[202px]">
          <img
            src={imageUrl}
            className="object-contain w-full h-full rounded-full"
            alt={name}
          />
        </div>

        {/* Name */}
        <h2 className="mt-7 text-[24px] font-medium tracking-normal leading-normal text-zinc-100 whitespace-nowrap text-center">
          {name}
        </h2>
      </div>
    </div>
  );
}

export default UserPhoto;
