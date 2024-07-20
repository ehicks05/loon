import React from "react";
import { setEq, useUserStore } from "../../../common/UserContextProvider";
import { LoonSlider } from "../../Slider";

export default function Eq() {
  const userState = useUserStore((state) => state.userState);

  function handleEqChange(e) {
    const eqNum = e.target.name.substring(2, 3);
    const field = e.target.name.substring(3);
    const value = e.target.value;

    setEq(eqNum, field, value);
  }

  function handleSliderChange(value, name) {
    const eqNum = name.substring(2, 3);
    const field = name.substring(3);
    setEq(eqNum, field, value);
  }

  const cellClass = "border border-neutral-600 p-2";

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

  const freqCells = eqs.map((eq) => (
    <td key={eq.name} className={cellClass}>
      <input
        className={"input text-right"}
        name={`${eq.name}Frequency`}
        type={"number"}
        min={20}
        max={20000}
        step={1}
        defaultValue={eq.frequency}
        onChange={handleEqChange}
      />
    </td>
  ));
  const gainCells = eqs.map((eq) => (
    <td key={eq.name} className={cellClass}>
      <div className="flex flex-col items-center h-56">
        <LoonSlider
          name={`${eq.name}Gain`}
          value={[eq.gain]}
          onValueChange={(value) =>
            handleSliderChange([value], `${eq.name}Gain`)
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
  ));
  const typeCells = eqs.map((eq) => (
    <td key={eq.name} className={`text-center ${cellClass}`}>
      {eq.type}
    </td>
  ));

  const eqTable = (
    <table style={{ padding: "8px" }}>
      <tbody>
        <tr>
          <td className={`text-center ${cellClass}`}>Freq</td>
          {freqCells}
        </tr>
        <tr>
          <td className={`text-center ${cellClass}`}>Gain</td>
          {gainCells}
        </tr>
        <tr>
          <td className={`text-center ${cellClass}`}>Type</td>
          {typeCells}
        </tr>
      </tbody>
    </table>
  );

  return (
    <div>
      <section className={"section"}>
        <h1 className="title">Settings</h1>
        <h2 className="subtitle">Equalizer</h2>

        {eqTable}
      </section>
    </div>
  );
}
