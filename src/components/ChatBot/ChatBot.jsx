import React, { useEffect, useState, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { BsDashLg } from "react-icons/bs";
import mqtt from "mqtt";

import { getMessageDB, sentMessage, sentMessageDB } from "../../services/chats";
import { useDispatch } from "react-redux";
import { setOpenMessRasa } from "../../redux/slices/app";
import Account from "../../assets/account.jpg"

const ChatBot = () => {
  const [mess, setMess] = useState([]);
  const [mqttClient, setMqttClient] = useState(null);
  const [value, setValue] = useState("");
  const [load, setLoad] = useState(false);
  const chatHistoryRef = useRef();
  const id = localStorage.getItem("id");
  const dispatch = useDispatch()
  const closeRasa = () => {
    dispatch(setOpenMessRasa(false))
  }
  const handleValue = (value) => {
    setValue(value);
  };
  const sentMess = (value, idSent, idReceived) => {
    const date_sent = Date.now();
    const params = {
      "idChat": id,
      "idSent": idSent,
      "idReceived": idReceived,
      "content": value,
      "date_sent": date_sent
    }
    sentMessageDB(params,
      (res) => //console.log(res),
        (err) => console.log(err)
    )
  }
  const getMessage = () => {

    const params = {
      "id": id
    }
    getMessageDB(
      params,
      (res) => {
        const data = res.data.messages;
        const mess = data.map((item) => {
          let sender = "user"
          if (item.idSent !== id) {
            sender = "bot"
          }
          return ({
            content: item.content,
            sender: sender,
            isText: true
          })
        });
        if (mess.length !== 0) {
          setMess(mess)
        }

      },
      (err) => console.log(err)
    )
  }
  useEffect(() => {
    getMessage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const handle = (message) => {
    setMess((prevMess) => [
      ...prevMess,
      { content: message.value, sender: message.id, isText: message.isText,payload: message.payload },
    ]);
  };
  useEffect(() => {
    const mqttBroker = "ws://192.168.8.19:9001"; // Thay đổi địa chỉ MQTT broker nếu cần
    const client = mqtt.connect(mqttBroker);

    client.on("connect", () => {
      // console.log("Connected to MQTT broker");
      client.subscribe(`rasa/${id}`);
      setMqttClient(client);
    });

    client.on("message", (topic, message) => {
      // console.log(message.toString());
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

      if (resultObject.id === "user") {
        const params = {
          sender: id,
          message: resultObject.value,
        };
        setLoad(true)
        sentMessage(
          params,
          (res) => {
            setLoad(false)
            console.log(res.data)
            res.data.forEach((item) => {
              if (item.text) {
                const formattedMessage = `{value=${item.text}$id=bot}`;
                const formattedMessageT = { value: item.text, id: "bot", isText: "text", payload: "" };
                client.publish(`rasa/${id}`, formattedMessage);
                handle(formattedMessageT);
                if (item.buttons) {
                  item.buttons.forEach((button) => {
                    const formattedMessageT = { value: button.title, id: "bot", isText: "button", payload: button.payload };
                    handle(formattedMessageT);
                  })
                }
              } else {
                const formattedMessage = `{value=${item.attachment.image}$id=bot}`;
                const formattedMessageT = { value: item.attachment.image, id: "bot", isText: "image", payload: "" };
                client.publish(`rasa/${id}`, formattedMessage);
                handle(formattedMessageT);
              }
            })
          },
          (err) => {
            console.log(err);
            setLoad(false)
          }
        );
      }
      else {
        sentMess(resultObject.value, "rasa", id)
      }
    });

    // Cleanup the MQTT client when the component unmounts
    return () => {
      client.end();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [mess]);
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      // Người dùng ấn phím "Enter", gửi tin nhắn
      if (mqttClient && mqttClient.connected && value.trim() !== "") {
        // Đảm bảo định dạng JSON nhất quán
        const formattedMessage = `{value=${value.toString()}$id=user}`;
        const formattedMessageT = { value: value, id: "user", isText: "text", payload: "" };
        mqttClient.publish(`rasa/${id}`, formattedMessage);
        handle(formattedMessageT);
        setValue("");
        sentMess(value, id, "rasa")
      }
    }
  };
  const publishMessage = (value) => {
    if (mqttClient && mqttClient.connected && value.trim() !== "") {
      // Đảm bảo định dạng JSON nhất quán
      const formattedMessage = `{value=${value.toString()}$id=user}`;
      const formattedMessageT = { value: value, id: "user", isText: "text", payload: "" };
      mqttClient.publish(`rasa/${id}`, formattedMessage);
      handle(formattedMessageT);
      setValue("");
      sentMess(value, id, "rasa")
    }
  };
  const updateName = (value,text) => {
    const formattedMessage = `{value=${value}$id=user}`;
    const formattedMessageT = { value: text, id: "user", isText: "text", payload: "" };
    mqttClient.publish(`rasa/${id}`, formattedMessage);
    handle(formattedMessageT);
  }

  return (
    <div className="chat1">
      <div className={`chat`}>
        <div className="chat-header">
          <div className="chat-title">
            <img
              src={Account}
              alt=""
            />
            <div className="chat-name">
              <p>Rasa</p>
              <span>Đang hoạt động</span>
            </div>
          </div>
          <div className="chat-icon">
            <BsDashLg />
            <IoMdClose onClick={() => closeRasa()} style={{ cursor: "pointer" }} />
          </div>
        </div>
        <div className="chat-history" ref={chatHistoryRef}>

          {mess.map((message, index) => {
            return (
              <div
                key={index}
                className={
                  message.sender === "user" ? "user-message" : "bot-message"
                }
              >

                {message.isText === "text" && <p>{message.content}</p>}
                {message.isText === "image" && <img src={message.content} alt="" />}
                <div className="button" style={{ display: "flex", gap: 10 }}>
                  {message.isText === "button" && <div className="button-item" onClick={()=> updateName(message.payload,message.content)}>{message.content}</div>}
                </div>

              </div>
            );
          })}
          <div
            className={"bot-message"}
          >
            <div>
              {load &&
                <div id="wave">
                  <span className="dot one"></span>
                  <span className="dot two"></span>
                  <span className="dot three"></span>
                </div>}

            </div>
          </div>
        </div>
        <div className="chat-input">
          <input
            value={value}
            onChange={(e) => handleValue(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e)}
          />

          <svg
            className={`${value === "" ? "chat-ok" : "chat-send"}`}
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            onClick={() => publishMessage(value)}
          >
            <title>Nhấn Enter để gửi</title>
            <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
