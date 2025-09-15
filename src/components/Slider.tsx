import * as Slider from "@radix-ui/react-slider";
import type { RefAttributes } from "react";

export const SLIDER_CLASSES = {
  ROOT:
    "relative flex items-center select-none touch-none w-full h-5 cursor-grab active:cursor-grabbing" +
    " data-[orientation=vertical]:flex-col data-[orientation=vertical]:w-5 data-[orientation=vertical]:h-full",
  TRACK:
    "bg-neutral-500 relative grow rounded-full h-1" +
    " data-[orientation=vertical]:h-auto data-[orientation=vertical]:w-1",
  RANGE:
    "absolute bg-green-500 rounded-full h-full" +
    " data-[orientation=vertical]:h-auto data-[orientation=vertical]:w-full",
  THUMB:
    "block w-3 h-3 bg-white shadow-2xl shadow-black rounded-full outline-none",
};

export const LoonSlider = (
  props: Slider.SliderProps & RefAttributes<HTMLSpanElement>,
) => {
  return (
    <Slider.Root className={SLIDER_CLASSES.ROOT} {...props}>
      <Slider.Track className={SLIDER_CLASSES.TRACK}>
        <Slider.Range className={SLIDER_CLASSES.RANGE} />
      </Slider.Track>
      <Slider.Thumb className={SLIDER_CLASSES.THUMB} />
    </Slider.Root>
  );
};
