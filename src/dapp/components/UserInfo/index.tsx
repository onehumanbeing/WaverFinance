import React from "react";
import { AiOutlineLogout } from "react-icons/ai";

import styles from "./index.module.scss";
import DefaultProfileImg from "../../assets/img/icons/profile.png";
import { useNearUser } from "react-near";
import Button from "../Button";

const UserInfoUI: React.FC<{
  className?: string;
  avatar?: string,
  hideAvatar?: boolean,
  hideTitle?: boolean,
  logout?: () => void,
  address?: string,
}> = ({ className, avatar, address, hideAvatar, hideTitle, logout }) => {
  return (
    <div className={`${styles.userCard} ${className}`}>
      <div className={styles.userCard__info}>
        {!hideTitle && <div className={styles.userCard__info__name}>My Account</div>}
        <div className={`${styles.userCard__info__address} ${hideTitle && styles.addressOnly}`}>{address}</div>
      </div>
      {!hideAvatar && <div className={`${styles.userCard__avatar}`}>
        {logout && <div className={styles.logoutInAvatar} onClick={logout}>
          <AiOutlineLogout className={styles.icon} />
        </div>}
        <img src={avatar ?? DefaultProfileImg.src} alt="avatar" />
      </div>}
    </div>
  );
}

const UserInfo: React.FC<{
  className?: string;
  avatar?: string,
  hideAvatar?: boolean,
  hideTitle?: boolean,
}> = ({ className, avatar, hideAvatar, hideTitle }) => {
  const nearUser = useNearUser();

  const login = async () => {
    await nearUser.connect();
  }

  if (!nearUser || !nearUser.isConnected) {
    return <Button className={styles.connBtn} type="minimal" onClick={login}>Connect Wallet</Button>;
  }

  const logout = async () => {
    await nearUser.disconnect();
  }

  return (
    <UserInfoUI
      className={className}
      avatar={avatar}
      hideAvatar={hideAvatar}
      hideTitle={hideTitle}
      address={nearUser.address!}
      logout={logout}
    />
  );
}

export default UserInfo;
