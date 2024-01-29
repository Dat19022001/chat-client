import { IoMdSearch } from "react-icons/io";
import { IoReload } from "react-icons/io5";
import "./sidebar.scss";
import { getRoomChats } from "../../services/chats";
import { useEffect, useState } from "react";
import {
  setDeleteMessRecevied,
  setStorageField,
} from "../../redux/slices/test";
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
              src="https://scontent.xx.fbcdn.net/v/t1.30497-1/143086968_2856368904622192_1959732218791162458_n.png?stp=dst-png_p100x100&_nc_cat=1&ccb=1-7&_nc_sid=db1b99&_nc_eui2=AeFX5JER1T-hUgp40eEfWzS2so2H55p0AlGyjYfnmnQCUUiS0k3AiFTbEKP_NS4T6nFxgs0kLY_wlp-ZbDu9rjfV&_nc_ohc=FaPLa6I4CdUAX8BdIwK&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=00_AfB5Ri94PG3vCu_NpkcauO6deYa-_28Hh9spQDOm-tGhdg&oe=65BC2178"
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
                src="https://scontent.xx.fbcdn.net/v/t1.30497-1/143086968_2856368904622192_1959732218791162458_n.png?stp=dst-png_p100x100&_nc_cat=1&ccb=1-7&_nc_sid=db1b99&_nc_eui2=AeFX5JER1T-hUgp40eEfWzS2so2H55p0AlGyjYfnmnQCUUiS0k3AiFTbEKP_NS4T6nFxgs0kLY_wlp-ZbDu9rjfV&_nc_ohc=FaPLa6I4CdUAX8BdIwK&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=00_AfB5Ri94PG3vCu_NpkcauO6deYa-_28Hh9spQDOm-tGhdg&oe=65BC2178"
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
