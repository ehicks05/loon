import {
  type EqBand,
  setEqBands,
  useUserStore,
} from "@/common/UserContextProvider";
import { LoonSlider } from "@/components/Slider";
import { TextInput } from "@/components/TextInput";

const FILTER_TYPE_LABELS: Partial<Record<BiquadFilterType, string>> = {
  lowshelf: "Low Shelf",
  peaking: "Peaking",
  highshelf: "High Shelf",
};

const cellClass = "border border-neutral-700 p-2";

export default function Eq() {
  const eqBands = useUserStore((state) => state.userState.eqBands);

  const handleUpdate = (newBand: EqBand, id: number) =>
    setEqBands(eqBands.map((band) => (band.id === id ? newBand : band)));

  const eqTable = (
    <table>
      <tbody>
        <tr>
          <td className={`text-center ${cellClass}`}>Freq</td>
          {eqBands.map((eq) => (
            <td key={eq.id} className={cellClass}>
              <TextInput
                className="bg-neutral-800 text-right"
                type="number"
                min={20}
                max={20000}
                step={1}
                value={eq.frequency}
                onChange={(e) => {
                  const frequency = Number(e.target.value);
                  handleUpdate({ ...eq, frequency }, eq.id);
                }}
              />
            </td>
          ))}
        </tr>
        <tr>
          <td className={`text-center ${cellClass}`}>Gain</td>
          {eqBands.map((eq) => (
            <td key={eq.id} className={cellClass}>
              <div className="flex flex-col items-center h-56">
                <LoonSlider
                  value={[eq.gain]}
                  onValueChange={(value) =>
                    handleUpdate({ ...eq, gain: value[0] }, eq.id)
                  }
                  onDoubleClick={() => handleUpdate({ ...eq, gain: 0 }, eq.id)}
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
          {eqBands.map((eq) => (
            <td key={eq.id} className={`text-center ${cellClass}`}>
              {FILTER_TYPE_LABELS[eq.type]}
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
