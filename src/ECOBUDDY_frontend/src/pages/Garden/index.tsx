import DonateBox from "../../components/Garden/DonateBox";
import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import { Link } from "react-router-dom";

export default function Garden() {
  const [donation, setDonation] = useState(1010);
  const [trees, setTrees] = useState<
    { id: number; x: number; y: number; type: string }[]
  >([]);
  const [boxDonation, setBoxDonation] = useState(false);

  function calculateDisplayedTrees(donationAmount: number): number {
    if (donationAmount <= 10) {
      return donationAmount;
    } else if (donationAmount > 10 && donationAmount <= 60) {
      return 10 + Math.floor((donation - 10) / 3);
    } else {
      return 30 + Math.floor((donation - 60) / 8);
    }
  }

  const treesPlanted = calculateDisplayedTrees(donation);

  const generateRandomTree = (id: number) => ({
    id,
    x: id == 1 ? 0 : Math.floor(Math.random() * 90) + 5,
    y: id == 1 ? 0 : Math.floor(Math.random() * 90) + 5,
    type: `/garden/tree-${Math.floor(Math.random() * 4) + 1}.png`,
  });

  useEffect(() => {
    setTrees((prevTrees) => {
      const newTrees = [...prevTrees];

      while (newTrees.length < treesPlanted) {
        newTrees.push(generateRandomTree(newTrees.length + 1));
      }

      return newTrees;
    });
  }, [treesPlanted]);

  const handleDonate = (input: number) => {
    setDonation((prev) => prev + input);
    setBoxDonation(false);
  };

  return (
    <div className="w-screen h-screen flex-col bg-gardenBackground relative flex overflow-hidden justify-end items-center">
      {/* BOX DONATION */}
      <DonateBox
        isActive={boxDonation}
        onSuccess={handleDonate}
        onClick={() => setBoxDonation(false)}
      />

      {/* TEXT */}
      <div className="flex flex-row justify-center items-center w-full relative h-full">
        <div className="flex flex-row justify-evenly relative w-full gap-4">
          <img
            src="/garden/clound-1.png"
            alt="cloud"
            className="max-w-none max-h-none m-0 w-40 relative top-24"
          />
          <img
            src="/garden/clound-1.png"
            alt="cloud"
            className="max-w-none max-h-none m-0 w-40 relative "
          />
        </div>
        <div className="flex flex-col justify-center items-center w-fit mx-12">
          <h1 className="text-white font-poppins text-4xl font-bold whitespace-nowrap">
            Your EcoTree
          </h1>
          <p className="text-whiteSoft font-poppins text-sm mt-2 whitespace-nowrap">
            Grow your tree & contribute to a greener planet!
          </p>
        </div>
        {/* CLOUD */}
        <div className="flex flex-row justify-evenly relative w-full gap-4">
          <img
            src="/garden/clound-2.png"
            alt="cloud"
            className="max-w-none max-h-none m-0 w-40 relative "
          />
          <img
            src="/garden/clound-2.png"
            alt="cloud"
            className="max-w-none max-h-none m-0 w-40 relative top-24"
          />
        </div>
      </div>

      {/* LAND */}
      <div className="relative w-fit min-w-full flex justify-center items-center">
        <div className="land relative min-w-full w-fit flex justify-center items-center overflow-hidden h-fit">
          <img
            src="/garden/land.png"
            alt="land"
            className="m-0 max-w-none max-h-none p-0 min-h-[70vh] sm:h-[40vh] w-auto"
          />
          {/* Tampilkan Pohon */}
        </div>
        <div className="w-full absolute h-[70vh] min-w-[1000px] bottom-0 flex justify-center items-center">
          {trees.map((tree) => (
            <Draggable key={tree.id} bounds="parent" grid={[20, 12]}>
              <div
                className={`absolute flex justify-center left-[${tree.x}%] top-[${tree.y}%]`}
                style={
                  tree.id != 1 ? { left: `${tree.x}%`, top: `${tree.y}%` } : {}
                }
              >
                <div className="tree w-full absolute top-0 left-0 h-full bg-transparent z-20"></div>
                <img
                  src={tree.type}
                  alt="tree"
                  className="relative max-w-32 w-full min-h-fit z-10 "
                />
                <div className="tree w-20 h-8 absolute -bottom-3 opacity-50 bg-darkSoft rounded-[100%] z-0"></div>
              </div>
            </Draggable>
          ))}
        </div>
      </div>

      {/* DONATE TRIGGER */}
      <div className="flex flex-col justify-center items-center gap-5 absolute bottom-16 z-10">
        <div className="flex flex-row justify-center items-center gap-3">
          {/* DONATED */}
          <div className="flex flex-col justify-start items-start gap-0 px-3 pe-6 py-2 bg-white rounded-md">
            <div className="flex flex-row justify-start items-center gap-2">
              <p className="font-poppins text-darkMain text-lg font-semibold">
                {donation}
              </p>
              <img
                src="/garden/ICP.png"
                alt="ICP"
                className="m-0 max-w-none max-h-none w-5"
              />
            </div>
            <p className="font-poppins text-darkMain text-sm">Donated so far</p>
          </div>

          {/* PLANTED */}
          <div className="flex flex-col justify-start items-start gap-0 px-3 pe-6 py-2 bg-white rounded-md">
            <div className="flex flex-row justify-start items-center gap-2">
              <p className="font-poppins text-darkMain text-lg font-semibold">
                {Math.floor(donation * 1.2)}
              </p>
            </div>
            <p className="font-poppins text-darkMain text-sm">Trees planted!</p>
          </div>
        </div>

        {/* DONATE BUTTON */}
        <button
          onClick={() => setBoxDonation(true)}
          className="bg-darkSoft px-12 hover:bg-darkMain duration-200 transition-all ease-in-out py-3 rounded-full font-poppins text-white cursor-pointer text-sm font-semibold"
        >
          Donate
        </button>
      </div>

      {/* BACK BUTTON */}
      <Link
        to={"/"}
        className="bg-greenMain flex justify-center gap-2 items-center absolute px-8 ps-5 hover:text-darkMain hover:bg-[#10DA79] left-8 top-8 duration-200 transition-all ease-in-out py-3 rounded-full font-poppins text-darkSoft cursor-pointer text-sm font-semibold"
      >
        <img
          src="/garden/left.svg"
          alt="left"
          className="w-4 m-0 max-w-none max-h-none"
        />
        Back
      </Link>
    </div>
  );
}
