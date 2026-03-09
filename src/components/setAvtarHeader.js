
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const SetAvtarImage = React.memo(() => {
  const isVerified = useSelector((state) => state.login.isVerified);
  const image = useSelector((state) => state.userDataUpdate.Image);

 useEffect(() => {
    if (!isVerified || !image) {
        return null;
      }
 }, [isVerified, image]);
 

  return (
    <div className="flex cursor-pointer items-center justify-center border-[1px] border-white w-[35px] overflow-hidden rounded-full">
      <img
        className="w-[35px] h-[35px] object-cover"
        src={`${image}?t=${new Date().getTime()}`} // force bypass browser cache
        alt="Avatar"
      />
    </div>
  );
});

export default SetAvtarImage;
