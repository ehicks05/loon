import { TextInput } from "@/components/TextInput";
import React from "react";
import { setEq, useUserStore } from "../../../common/UserContextProvider";
import { LoonSlider } from "../../Slider";

export default function Eq() {
  const userState = useUserStore((state) => state.userState);

  function handleSliderChange(value: number, name: string) {
    const eqNum = name.substring(2, 3);
    const field = name.substring(3);
    setEq(eqNum, field, value);
  }

  const cellClass = "border border-neutral-700 p-2";

  const eqs = [
    {
      name: "eq1",
      frequency: userState.eq1Frequency,
      gain: userState.eq1Gain,
      type: "Low Shelf",
    },
    {
      name: "eq2",
      frequency: userState.eq2Frequency,
      gain: userState.eq2Gain,
      type: "Peaking",
    },
    {
      name: "eq3",
      frequency: userState.eq3Frequency,
      gain: userState.eq3Gain,
      type: "Peaking",
    },
    {
      name: "eq4",
      frequency: userState.eq4Frequency,
      gain: userState.eq4Gain,
      type: "High Shelf",
    },
  ];

  const eqTable = (
    <table>
      <tbody>
        <tr>
          <td className={`text-center ${cellClass}`}>Freq</td>
          {eqs.map((eq) => (
            <td key={eq.name} className={cellClass}>
              <TextInput
                className={"bg-neutral-800 text-right"}
                name={`${eq.name}Frequency`}
                type={"number"}
                min={20}
                max={20000}
                step={1}
                defaultValue={eq.frequency}
                onChange={(e) => {
                  const eqNum = e.target.name.substring(2, 3);
                  const field = e.target.name.substring(3);
                  const value = e.target.value;

                  setEq(eqNum, field, value);
                }}
              />
            </td>
          ))}
        </tr>
        <tr>
          <td className={`text-center ${cellClass}`}>Gain</td>
          {eqs.map((eq) => (
            <td key={eq.name} className={cellClass}>
              <div className="flex flex-col items-center h-56">
                <LoonSlider
                  name={`${eq.name}Gain`}
                  value={[eq.gain]}
                  onValueChange={(value) =>
                    handleSliderChange(value[0], `${eq.name}Gain`)
                  }
                  min={-12}
                  max={12}
                  step={1}
                  orientation="vertical"
                />
                <span>
                  {eq.gain > 0 ? "+" : ""}
                  {eq.gain} dB
                </span>
              </div>
            </td>
          ))}
        </tr>
        <tr>
          <td className={`text-center ${cellClass}`}>Type</td>
          {eqs.map((eq) => (
            <td key={eq.name} className={`text-center ${cellClass}`}>
              {eq.type}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );

  return (
    <section className={"flex flex-col gap-4 items-start"}>
      <div>
        <h1 className="font-bold text-2xl">Settings</h1>
        <h2 className="">Equalizer</h2>
      </div>

      {eqTable}
    </section>
  );
}
