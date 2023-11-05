import { gsap } from "gsap";
import { useLayoutEffect, useRef } from "react";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";

import HomeLayout from "./layout";
import { FaBottleWater } from "react-icons/fa6";
import { BsArrowDown } from "react-icons/bs";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function Home() {
  const comp = useRef();
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.to(".parallax-bg", {
        scrollTrigger: {
          scrub: 1,
        },
        y: (i, target) => -ScrollTrigger.maxScroll(window),
        ease: "none",
      });
      gsap.to(".bottle", {
        scrollTrigger: {
          scrub: 1,
          markers: true,
        },
        y: (i, target) => ScrollTrigger.maxScroll(window),
        ease: "none",
      });
      gsap.to(".fade", {
        scrollTrigger: {
          scrub: 1,
        },
        opacity: () => 1 - ScrollTrigger.maxScroll(window),
      });
    }, comp);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={comp}>
      <HomeLayout>
        <Hero />
        <section id="ocean" className="parallax-bg" data-speed=".4">
          <h1 className="text-primary">the ocean</h1>
          <h1 className="text-primary/80">the ocean</h1>
          <h1 className="text-primary/60">the ocean</h1>
          <h1 className="text-primary/40">the ocean</h1>
          <h1 className="text-primary/20">the ocean</h1>
        </section>
      </HomeLayout>
    </div>
  );
}

const Hero = () => {
  const handleClick = (e) => {
    gsap.to(window, { duration: 1, scrollTo: "#ocean" });
  };

  return (
    <section
      className="flex h-screen flex-col items-center justify-center space-y-6"
      data-speed=".75"
    >
      <h2 className="parallax-bg text-6xl">
        see where your <font className="text-primary">plastic bottle</font>{" "}
        goes.
      </h2>
      <div
        onClick={handleClick}
        className="group flex cursor-pointer flex-col items-center space-y-4"
      >
        <span className="fade">(click to throw)</span>
        <div className="bottle" data-speed="0.75">
          <FaBottleWater
            onClick={handleClick}
            className="text-4xl group-hover:text-primary"
          />
        </div>
        <BsArrowDown className="fade text-3xl" />
      </div>
    </section>
  );
};
