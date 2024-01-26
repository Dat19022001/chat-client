import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./home.scss";
import Sidebar from "../../components/sidebar/sidebar";
import { Register, updateUSer } from "../../services/chats";
import { useDispatch, useSelector } from "react-redux";
import mqtt from "mqtt";
import Chat from "../../components/itemChat/Chat";
import { setMessRecevied } from "../../redux/slices/test";
const Home = () => {
  const [idUser, setIdUser] = useState(localStorage.getItem("id") || null);
  const [name, setName] = useState(localStorage.getItem("name") || null);
  const [listFriend, setListFriend] = useState(
    JSON.parse(localStorage.getItem("list")) || []
  );
  const [value, setValue] = useState("");
  const { updateListFriend } = useSelector((states) => states.app);
  const { storageField } = useSelector((states) => states.test);
  const dispatch = useDispatch();

  const Register1 = () => {
    const uniqueId = uuidv4();
    localStorage.setItem("name", value);
    setName(value);
    const params = {
      UserName: value,
      idUser: uniqueId,
    };
    Register(
      params,
      (res) => {
        setListFriend(res.data.user.listFriend);
        localStorage.setItem("id", uniqueId);
        setIdUser(uniqueId);
        localStorage.setItem("list", JSON.stringify(res.data.user.listFriend));
      },
      (err) => {
        console.log(err);
      }
    );
  };
  const onChange = (value) => {
    setValue(value);
  };
  useEffect(() => {
    const mqttBroker = "ws://172.18.0.1:9001"; // Thay đổi địa chỉ MQTT broker nếu cần
    const client = mqtt.connect(mqttBroker);

    client.on("connect", () => {
      listFriend.forEach((topic) => {
        client.subscribe(`${topic}`);
      });
    });

    client.on("message", (topic, message) => {
      console.log(message.toString(), topic);
      const inputString = message.toString();

      // Loại bỏ ký tự `{` và `}` từ chuỗi
      const trimmedString = inputString.slice(1, -1);

      // Chia chuỗi thành mảng các cặp key-value
      const keyValuePairs = trimmedString.split("$");

      // Tạo đối tượng từ mảng key-value
      const resultObject = keyValuePairs.reduce((acc, pair) => {
        const [key, value] = pair.split("=");
        acc[key] = value;
        return acc;
      }, {});
      if (resultObject.id === idUser) {
        const check = storageField.some(
          (item) => item.idChat === parseInt(topic)
        );
        if (!check) {
          dispatch(setMessRecevied(topic));
        }
      }
    });
    // Cleanup the MQTT client when the component unmounts
    return () => {
      client.end();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageField,listFriend]);

  useEffect(() => {
    if (updateListFriend !== null) {
      const params = {
        id: idUser,
      };
      updateUSer(
        params,
        (res) => {
          setListFriend(res.data.user.listFriend);
          localStorage.setItem(
            "list",
            JSON.stringify(res.data.user.listFriend)
          );
        },
        (err) => {
          console.log(err);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateListFriend]);
  return (
    <div className="home">
      <div className="home-content">
        {idUser === null ? (
          <div className="home-register">
            <input
              placeholder="Name"
              onChange={(e) => onChange(e.target.value)}
            />
            <div className="home-btn" onClick={() => Register1()}>
              Register
            </div>
          </div>
        ) : (
          <div className="home-title">
            Xin chao {name} da den voi room chat{" "}
          </div>
        )}
        <Sidebar listFriend={listFriend} idUser={idUser} />
        <div className="home-chat">
          {storageField.map((item, index) => (
            <Chat item={item} idUser={idUser} key={item.idChat} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
