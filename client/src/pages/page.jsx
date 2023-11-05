import { gsap } from "gsap";
import { useLayoutEffect, useRef } from "react";

import HomeLayout from "./layout";
import PlasticBottlesFall from "../components/hero/bottles";
import { FaBottleWater } from "react-icons/fa6";
import { BsArrowDown } from "react-icons/bs";

export default function Home() {
  return (
    <HomeLayout>
      <Hero />
      <section>
        <h1 className="text-primary">the ocean</h1>
        <h1 className="text-primary/80">the ocean</h1>
        <h1 className="text-primary/60">the ocean</h1>
        <h1 className="text-primary/40">the ocean</h1>
        <h1 className="text-primary/20">the ocean</h1>
      </section>
      <div className="grid grid-cols-2">
        <PlasticBottlesFall />
        <span className="p-16">
          <h1>over time, these plastic bottles add up</h1>
        </span>
      </div>
    </HomeLayout>
  );
}

const Hero = () => {
  const bottleRef = useRef();

  useLayoutEffect(() => {
    gsap.to(bottleRef.current, {
      rotation: "+=360",
    });
  }, [bottleRef]);

  function handleClick() {
    console.log("clicked");
  }

  return (
    <section className="flex h-screen flex-col items-center justify-center space-y-6">
      <h2 className="text-6xl">
        see where your <font className="text-primary">plastic bottle</font>{" "}
        goes.
      </h2>
      <div
        onClick={handleClick}
        className="group flex cursor-pointer flex-col items-center space-y-4"
      >
        <p>(click to throw)</p>

        <div ref={bottleRef}>
          <FaBottleWater className="group-hover:text-primary text-4xl" />
        </div>
        <BsArrowDown className="text-3xl" />
      </div>
    </section>
  );
};
