import { CrudManager, type CrudField } from "@/components/CrudManager";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDailyRoutines,
  updateDailyRoutine,
  selectDailyRoutines,
  selectDailyRoutineLoading,
  selectDailyRoutineError
} from "@/store/dailyRoutineSlice";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const rashiFields: CrudField[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "prediction", label: "Prediction", type: "textarea", required: true },
  { name: "image", label: "Image", type: "image", required: false },
];

const panchangFields: CrudField[] = [
  { name: "nakshatra", label: "Nakshatra", type: "text" },
  { name: "moonset", label: "Moonset", type: "text" },
  { name: "karana", label: "Karana", type: "text" },
  { name: "tithi", label: "Tithi", type: "text" },
  { name: "moonrise", label: "Moonrise", type: "text" },
  { name: "sunset", label: "Sunset", type: "text" },
  { name: "sunrise", label: "Sunrise", type: "text" },
  { name: "vaara", label: "Vaara", type: "text" },
  { name: "image", label: "Image", type: "image" },
  { name: "yoga", label: "Yoga", type: "text" },
  {
    name: "location",
    label: "Location",
    type: "object",
    fields: [
      { name: "latitude", label: "Latitude", type: "text" },
      { name: "longitude", label: "Longitude", type: "text" },
      { name: "city", label: "City", type: "text" },
    ],
  },
];

export default function DailyRoutinesPage() {
  const dispatch = useDispatch();
  const dailyRoutines = useSelector(selectDailyRoutines);
  const isLoading = useSelector(selectDailyRoutineLoading);
  const error = useSelector(selectDailyRoutineError);
  const [selectedRoutine, setSelectedRoutine] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchDailyRoutines() as any);
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(typeof error === "string" ? error : "An error occurred");
    }
  }, [error]);

  useEffect(() => {
    if (dailyRoutines && dailyRoutines.length > 0) {
      // Unwrap dailyData for UI
      const routine = dailyRoutines[0];
      if (routine.dailyData) {
        setSelectedRoutine({ ...routine.dailyData, id: routine.id });
      } else {
        setSelectedRoutine(routine);
      }
    }
  }, [dailyRoutines]);

  if (!selectedRoutine) {
    return <div className="p-6">No daily routine found.</div>;
  }

  // CRUD handlers for rashis
  const handleCreateRashi = async (form: any) => {
    const newRashis = [...(selectedRoutine.rashis || []), form];
    await dispatch(updateDailyRoutine({ id: selectedRoutine.id, form: { dailyData: { ...selectedRoutine, rashis: newRashis } } }) as any);
  };
  const handleEditRashi = async (idx: number, form: any) => {
    const newRashis = [...(selectedRoutine.rashis || [])];
    newRashis[idx] = form;
    await dispatch(updateDailyRoutine({ id: selectedRoutine.id, form: { dailyData: { ...selectedRoutine, rashis: newRashis } } }) as any);
  };
  const handleDeleteRashi = async (idx: number) => {
    const newRashis = [...(selectedRoutine.rashis || [])];
    newRashis.splice(idx, 1);
    await dispatch(updateDailyRoutine({ id: selectedRoutine.id, form: { dailyData: { ...selectedRoutine, rashis: newRashis } } }) as any);
  };

  // CRUD handlers for panchang (as array of one object for table)
  const panchangArray = selectedRoutine.panchang
    ? [{ ...selectedRoutine.panchang, id: selectedRoutine.id }]
    : [];
  const handleCreatePanchang = async (form: any) => {
    await dispatch(updateDailyRoutine({ id: selectedRoutine.id, form: { dailyData: { ...selectedRoutine, panchang: form } } }) as any);
  };
  const handleEditPanchang = async (id: any, form: any) => {
    await dispatch(updateDailyRoutine({ id, form: { dailyData: { ...selectedRoutine, panchang: form } } }) as any);
  };
  const handleDeletePanchang = async () => {
    await dispatch(updateDailyRoutine({ id: selectedRoutine.id, form: { dailyData: { ...selectedRoutine, panchang: {} } } }) as any);
  };

  const rashisWithId = (selectedRoutine.rashis || []).map((r: any, idx: number) => ({ ...r, id: String(idx) }));

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Daily Routine: {selectedRoutine.title} ({selectedRoutine.date})</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <CrudManager
            resourceName="Rashi"
            fields={rashiFields}
            data={rashisWithId}
            loading={isLoading}
            onCreate={handleCreateRashi}
            onEdit={(id, form) => handleEditRashi(Number(id), form)}
            onDelete={id => handleDeleteRashi(Number(id))}
            formInitialState={{ name: "", prediction: "", image: "" }}
            formValidation={form => {
              if (!form.name) return "Name is required";
              if (!form.prediction) return "Prediction is required";
              return null;
            }}
          />
        </div>
        <div>
          <CrudManager
            resourceName="Panchang"
            fields={panchangFields}
            data={panchangArray}
            loading={isLoading}
            onCreate={handleCreatePanchang}
            onEdit={handleEditPanchang}
            onDelete={handleDeletePanchang}
            formInitialState={{
              nakshatra: "",
              moonset: "",
              karana: "",
              tithi: "",
              moonrise: "",
              sunset: "",
              sunrise: "",
              vaara: "",
              image: "",
              yoga: "",
            }}
            formValidation={_form => null}
          />
        </div>
      </div>
    </div>
  );
} 