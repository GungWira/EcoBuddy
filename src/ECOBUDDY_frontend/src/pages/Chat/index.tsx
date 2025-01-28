import { Link } from "react-router-dom";
import Shine from "../../components/Shine";
import React, { useEffect, useRef, useState } from "react";
import Bot from "../../components/Chat/Bot";
import SugestChat from "../../components/Chat/SugestChat";
import Comand from "../../components/Chat/Comand";
import Response from "../../components/Chat/Response";
import Wallet from "../../components/Chat/Wallet";
import EditProfile from "../../components/Chat/EditProfile";
import { useAuth } from "../../hooks/AuthProvider";
import { useNavigate } from "react-router-dom";
import LoadingDots from "../../components/Chat/LoadingDots";
import Menu from "../../components/Chat/Menu";
import DailyQuest from "../../components/Chat/DailyQuest";

export default function Chat() {
  const navigate = useNavigate();

  const {
    logout,
    principal,
    user,
    loading,
    callFunction,
    isAuth,
    updateUser,
    dailyQuest,
    updateDailyQuest,
  } = useAuth();
  const [isIntro, setIsIntro] = useState<boolean>(true);
  const [isWallet, setIsWallet] = useState<boolean>(false);
  const [isEditProfile, setIsEditProfile] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>("");
  const [command, setCommand] = useState<string[]>([]);
  const [response, setResponse] = useState<string[]>([]);
  const [myBuddy, setMyBuddy] = useState({
    level: 1,
    title:
      "I’m <span className='text-green-500'>Ecobuddy</span>, Your AI Assistant",
    description:
      "Chat with EcoBuddy, gain XP, level up, and unlock fun features. Let’s grow together for a greener future!",
    isIntro: true,
    prog: 10,
  });

  const [username, setUsername] = useState<string | undefined>(user?.username);
  const [walletAddres, setWalletAddres] = useState<string | undefined>(
    user?.walletAddres
  );
  const [level, setLevel] = useState<number | undefined>(user?.level);
  const [isGenerateAnswer, setIsGenerateAnswer] = useState<Boolean>(false);
  const [isFinishTyping, setIsFinishTyping] = useState(true);
  const [isDailyQuest, setIsDailyQuest] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && isAuth) {
      setUsername(user.username);
      setWalletAddres(user.walletAddres);
      setLevel(Number(user.level));

      setMyBuddy({
        level: Number(user.level),
        title:
          "I’m <span className='text-green-500'>Ecobuddy</span>, Your AI Assistant",
        description:
          "Chat with EcoBuddy, gain XP, level up, and unlock fun features. Let’s grow together for a greener future!",
        isIntro: true,
        prog: Number(user.expPoints),
      });
    } else {
    }
  }, [user, isAuth]);

  const handlerMyBuddy = () => {
    if (user) {
      setMyBuddy({
        level: Number(user.level),
        title: "Almost There! EcoBuddy is Leveling Up with You!",
        description:
          "You're making great progress! Just a few more steps and EcoBuddy will reach the next level.",
        isIntro: false,
        prog: Number(user.expPoints),
      });
      setIsIntro(true);
    }
  };

  const handlerChat = async () => {
    // let wow = await callFunction.askQuiz("Botol plastik");
    // let woww = JSON.parse(wow);
    if (userInput.trim() !== "" && isFinishTyping) {
      setIsGenerateAnswer(true);
      setIsFinishTyping(false);
      setCommand((prev) => [...prev, userInput]);
      const input = userInput;
      setUserInput("");

      try {
        const botAns = await callFunction.askBot(input, principal);
        setIsGenerateAnswer(false);
        if ("err" in botAns) {
          setResponse((prev) => [...prev, botAns.err]);
        } else {
          setResponse((prev) => [...prev, botAns.ok.solution]);
          updateUser({
            id: principal,
            username: username,
            level: level,
            walletAddres: walletAddres,
            expPoints: user.expPoints + botAns.ok.exp,
          });
          if (dailyQuest) {
            updateDailyQuest({
              login: dailyQuest.login,
              date: dailyQuest.date,
              chatCount: dailyQuest.chatCount + 1,
              quizCount: dailyQuest.quizCount,
            });
          }
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handlerChat();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [command, response]);

  const handlerLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <main>
      <div className="bg-darkMain w-full relative">
        <div className="min-w-screen min-h-screen bg-mainBackground bg-4 px-4 md:px-8 flex flex-col justify-start items-center">
          {/* WELCOME SECTION */}
          <Bot
            level={myBuddy.level}
            title={myBuddy.title}
            description={myBuddy.description}
            isIntro={myBuddy.isIntro}
            prog={myBuddy.prog}
            hidden={!isIntro}
            loading={loading}
            onClick={() => {
              setIsIntro(false);
            }}
          />

          {/* WALLET */}
          <Wallet
            balance={1}
            address={walletAddres || ""}
            hidden={!isWallet}
            onClick={() => setIsWallet(false)}
          />

          {/* EDIT PROFILE */}
          <EditProfile
            urlProfile="/chat/default-profile.png"
            username={username}
            setUsername={setUsername}
            principal={principal}
            hidden={!isEditProfile}
            onClick={() => setIsEditProfile(false)}
          />

          {/* DAILY QUEST */}
          <DailyQuest
            dailyQuest={dailyQuest}
            hidden={!isDailyQuest}
            onClick={() => setIsDailyQuest(false)}
          />

          <div
            className={`w-screen h-screen fixed top-0 left-0 inset-0 bg-darkMain bg-opacity-50 backdrop-blur-md transition-all ease-in-out duration-300 ${
              isWallet || isEditProfile || isIntro
                ? "z-10 opacity-100"
                : "z-0 opacity-0"
            }`}
          ></div>

          {/* CHAT SECTION */}
          {/* FIRST CHAT */}
          {command.length == 0 ? (
            <div className="flex w-screen h-screen justify-center items-center">
              <div className="flex flex-col justify-center items-center max-w-3xl gap-8 w-full relative bottom-8 px-4 sm:px-8">
                <div className="flex flex-col justify-center items-center gap-2">
                  <img
                    src={`/chat/bot-lv-1.svg`}
                    alt="Bot"
                    className="w-24 max-w-none max-h-none"
                  />
                  <p className="font-poppins text-whiteSoft text-center text-sm sm:text-sm md:text-base">
                    Welcome, User
                  </p>
                  <h1 className="font-poppins text-white text-center font-bold text-2xl sm:text-2xl md:text-2xl lg:text-3xl">
                    How can i help you?
                  </h1>
                </div>
                <div className="flex flex-col justify-center items-start sm:items-center w-full gap-6 overflow-hidden">
                  <div className="w-full justify-center items-center px-4 fixed left-0 bottom-8 sm:relative sm:bottom-0 sm:px-0 ">
                    <div className="w-full bg-darkSoft flex flex-row justify-between items-center gap-4 p-3 rounded-lg">
                      {/* INPUT FILE */}
                      <div className="flex justify-center items-center aspect-square w-7 relative">
                        <input
                          type="file"
                          name=""
                          id=""
                          className="opacity-0 z-10 relative w-7 m-0 h-7 aspect-square overflow-hidden"
                        />
                        <img
                          src="/chat/image.svg"
                          alt="Image Icon"
                          className="w-7 m-0 max-w-none max-h-none absolute"
                        />
                      </div>
                      {/* INPUT TEXT */}
                      <input
                        type="text"
                        placeholder="Type something..."
                        autoComplete="off"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="font-poppins text-white text-sm sm:text-sm md:text-base w-full bg-transparent outline-none opacity-70"
                      />
                      {/* SUBMIT BUTTON */}
                      <button
                        typeof="button"
                        onClick={() => handlerChat()}
                        className="px-4 rounded-md gap-2 bg-greenMain flex justify-center items-center h-7 overflow-hidden"
                      >
                        <img src="/chat/send.svg" alt="Send Icon" />
                        <p className="text-sm sm:text-sm md:text-base text-darkMain font-semibold font-poppins">
                          Send
                        </p>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between items-stretch gap-4 sm:gap-5 md:gap-6 w-full max-w-full overflow-x-scroll overflow-y-hidden sm:overflow-y-hidden sm:overflow-x-hidden scrollbar-none">
                    <SugestChat
                      imageUrl="/chat/recycle.svg"
                      onClick={() => setCommand(["How do I sort my waste?"])}
                    >
                      How do I sort my waste?
                    </SugestChat>
                    <SugestChat
                      imageUrl="/chat/lamp.svg"
                      onClick={() =>
                        setCommand([
                          "Give me eco-friendly tips for my daily routine.",
                        ])
                      }
                    >
                      Give me eco-friendly tips for my daily routine.
                    </SugestChat>
                    <SugestChat
                      imageUrl="/chat/foot.svg"
                      onClick={() =>
                        setCommand([
                          "What eco-friendly actions can I do today?",
                        ])
                      }
                    >
                      What eco-friendly actions can I do today?
                    </SugestChat>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="min-w-full min-h-screen flex justify-start items-start px-4 sm:px-8 overflow-hidden">
              {/* NAVBAR */}
              <div className="flex flex-row justify-center items-center w-full py-6 fixed top-0 left-0 px-4 sm:px-8 bg-darkMain">
                <div className="flex flex-row justify-between items-center w-full max-w-6xl relative">
                  <div className="flex flex-row justify-start items-center gap-4">
                    <Link to={"/"}>
                      <img
                        src="/chat/logo.svg"
                        alt="Logo EcoBuddy"
                        className="max-w-none max-h-none m-0 w-28"
                      />
                    </Link>
                    <div className="hidden sm:flex">
                      <Shine>
                        <span className="hidden sm:flex">ver</span> 1.0
                      </Shine>
                    </div>
                  </div>
                  <div className="flex flex-row justify-end items-center gap-4">
                    <button
                      typeof="button"
                      className="w-fit max-w-36 rounded-full px-2 gap-2 py-1 border border-whiteSoft flex flex-row justify-start items-center relative group z-10"
                    >
                      <img
                        src="/chat/default-profile.png"
                        alt="User Profile"
                        className="max-w-none max-h-none m-0 rounded-full w-6"
                      />
                      <p className="font-poppins text-white opacity-80 font-semibold text-sm sm:text-sm md:text-base pr-2">
                        {username}
                      </p>
                      {/* MORE NAVBAR */}
                      <div className="group-hover:flex hover:flex w-80 absolute top-8 right-0 hidden z-10">
                        <div className="flex-col justify-start items-start w-80 rounded-xl bg-darkSoft border border-whiteSoft px-4 relative top-2">
                          {/* ECOBUDDY */}
                          <button
                            className="flex justify-start items-center gap-4 py-4 border-b border-whiteSoft w-full hover:ps-2 transition-all ease-in-out duration-150"
                            onClick={() => handlerMyBuddy()}
                          >
                            <img
                              src="/chat/bot-icon.svg"
                              alt="Bot Icon"
                              className="max-w-none max-h-none m-0 w-6"
                            />
                            <p className="font-poppins text-white opacity-80 font-semibold text-sm sm:text-sm md:text-base">
                              My Ecobuddy
                            </p>
                          </button>
                          {/* WALLET */}
                          <button
                            className="flex justify-start items-center gap-4 py-3 pt-4 w-full hover:ps-2 transition-all ease-in-out duration-150"
                            onClick={() => setIsWallet(true)}
                          >
                            <img
                              src="/chat/wallet-icon.svg"
                              alt="Bot Icon"
                              className="max-w-none max-h-none m-0 w-6"
                            />
                            <p className="font-poppins text-white opacity-80 font-semibold text-sm sm:text-sm md:text-base">
                              Wallet
                            </p>
                          </button>
                          {/* PROFILE */}
                          <button
                            className="flex justify-start items-center gap-4 py-3 w-full hover:ps-2 transition-all ease-in-out duration-150"
                            onClick={() => setIsEditProfile(true)}
                          >
                            <img
                              src="/chat/profile-icon.svg"
                              alt="Bot Icon"
                              className="max-w-none max-h-none m-0 w-6"
                            />
                            <p className="font-poppins text-white opacity-80 font-semibold text-sm sm:text-sm md:text-base">
                              Edit Profile
                            </p>
                          </button>
                          {/* PREMIUM */}
                          <Link
                            to={"/chat/premium"}
                            className="flex justify-start items-center gap-4 py-3 pb-4 border-b border-whiteSoft w-full hover:ps-2 transition-all ease-in-out duration-150"
                          >
                            <img
                              src="/chat/premium-icon.svg"
                              alt="Bot Icon"
                              className="max-w-none max-h-none m-0 w-6"
                            />
                            <p className="font-poppins text-white opacity-80 font-semibold text-sm sm:text-sm md:text-base">
                              Premium Plan
                            </p>
                          </Link>
                          {/* LOGOUT */}
                          <button
                            className="flex justify-start items-center gap-4 py-4 w-full hover:ps-2 transition-all ease-in-out duration-150"
                            onClick={handlerLogout}
                          >
                            <img
                              src="/chat/logout-icon.svg"
                              alt="Bot Icon"
                              className="max-w-none max-h-none m-0 w-6"
                            />
                            <p className="font-poppins text-white opacity-80 font-semibold text-sm sm:text-sm md:text-base">
                              Logout
                            </p>
                          </button>
                        </div>
                      </div>
                    </button>
                    <Menu onClick={() => setIsDailyQuest(true)} />
                  </div>
                </div>
              </div>

              {/* CHAT AREA */}
              <div className="w-full flex justify-center items-center  pt-24">
                <div className="w-full flex flex-col justify-start items-start gap-6 max-w-6xl pb-8">
                  {command.map((cmd, index) => (
                    <React.Fragment key={index}>
                      <Comand>{cmd}</Comand>
                      {response[index] && (
                        <Response onFinish={() => setIsFinishTyping(true)}>
                          {response[index]}
                        </Response>
                      )}
                    </React.Fragment>
                  ))}
                  {isGenerateAnswer && <LoadingDots />}
                  <div ref={chatEndRef} className="pb-12" />
                </div>
              </div>

              {/* INPUT AREA */}
              <div className="w-full flex justify-center items-center bg-darkMain pb-8 fixed bottom-0 left-0 px-4 sm:px-8">
                <div className="w-full max-w-6xl bg-darkSoft flex flex-row justify-between items-center gap-4 p-3 rounded-lg">
                  {/* INPUT FILE */}
                  <div className="flex justify-center items-center aspect-square w-7 relative">
                    <input
                      type="file"
                      name=""
                      id=""
                      className="opacity-0 z-10 relative w-7 m-0 h-7 aspect-square overflow-hidden"
                    />
                    <img
                      src="/chat/image.svg"
                      alt="Image Icon"
                      className="w-7 m-0 max-w-none max-h-none absolute"
                    />
                  </div>
                  {/* INPUT TEXT */}
                  <input
                    type="text"
                    placeholder="Type something..."
                    autoComplete="off"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="font-poppins text-white text-sm sm:text-sm md:text-base w-full bg-transparent outline-none opacity-70"
                  />
                  {/* SUBMIT BUTTON */}
                  <button
                    typeof="button"
                    onClick={() => handlerChat()}
                    className="px-4 rounded-md gap-2 bg-greenMain flex justify-center items-center h-7 overflow-hidden"
                  >
                    <img src="/chat/send.svg" alt="Send Icon" />
                    <p className="text-sm sm:text-sm md:text-base text-darkMain font-semibold font-poppins">
                      Send
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
