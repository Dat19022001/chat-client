import { IoMdSearch } from "react-icons/io";
import { IoReload } from "react-icons/io5";
import "./sidebar.scss";
import { getRoomChats } from "../../services/chats";
import { useEffect, useState } from "react";
import {
  setDeleteMessRecevied,
  setStorageField,
} from "../../redux/slices/test";
import Account from "../../assets/account.jpg"
import { setOpenMessRasa, setUpdateListFriend } from "../../redux/slices/app";

import { useDispatch, useSelector } from "react-redux";
const Sidebar = ({ listFriend, idUser }) => {
  const [friend, setFriend] = useState([]);
  const { messRecevied } = useSelector((states) => states.test);
  const dispatch = useDispatch();
  const check = (id) => {
    const isValueIncluded = messRecevied.includes(`${id}`);
    return isValueIncluded;
  };
  const openMess = (item) => {
    const mess = {
      idChat: item.id,
      friend_name: item.friend_name,
      idFriend: item.idFriend,
    };
    dispatch(setStorageField(mess));
  };
  const update = () => {
    dispatch(setUpdateListFriend(Date.now()));
  };
  const sentMess = (id) => {
    dispatch(setDeleteMessRecevied(`${id}`));
  };
  const openChatRasa = () => {
    dispatch(setOpenMessRasa(true))
  }
  useEffect(() => {
    if (listFriend.length !== 0) {
      const params = {
        listFriend: listFriend,
        idUser: idUser,
      };
      getRoomChats(
        params,
        (res) => {
          // console.log(res.data.listFriend)
          setFriend(res.data.listFriend);
        },
        (err) => {
          setFriend([]);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listFriend]);
  useEffect(() => {}, [messRecevied]);

  return (
    <div className="sidebar">
      <div className="sidebar-title">
        <p>Người liên hệ</p>
        <div className="sidebar-icon">
          <IoMdSearch />
          <IoReload onClick={() => update()} />
        </div>
      </div>
      <div className="sidebar-content">
        <div className="sidebar-item" onClick={() => openChatRasa() }>
          <div className="sidebar-img">
            <img
              src={Account}
              alt=""
            />
            <span className="sidebar-online"></span>
          </div>
          <div className="sidebar-name">Rasa</div>
        </div>
        {friend.map((item, index) => (
          <div
            className="sidebar-item"
            key={index}
            onClick={() => {
              openMess(item);
              sentMess(item.id);
            }}
          >
            <div className="sidebar-img">
              <img
                src={Account}
                alt=""
              />
              <span className="sidebar-online"></span>
            </div>
            <div className="sidebar-name">{item.friend_name}</div>
            {check(item.id) && <div>Co tin nha</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
