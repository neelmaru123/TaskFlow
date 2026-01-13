import { AiOutlineClose } from "react-icons/ai";

type ConfirmDeleteProps = {
  onClose: () => void;
  DeleteFn: () => void;
  label: string;
};

function ConfrimDelete({ onClose, label, DeleteFn }: ConfirmDeleteProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full md:max-w-md bg-slate-900 rounded-t-2xl md:rounded-xl p-5 m-5 shadow-xl">
        <div className="flex justify-between">
          <h2 className="text-lg font-bold text-white mb-4">Confrim Delete</h2>
          <AiOutlineClose
            onClick={onClose}
            size={25}
            className="cursor-pointer"
          />
        </div>

        <p className="text-xl font-semibold text-white my-8">
          Are you sure want to delete the {label}?
        </p>

        <div className="flex gap-3 ">
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
            onClick={DeleteFn}
          >
            Delete
          </button>

          <button
            className="bg-slate-400 hover:bg-slate-500 text-slate-950 px-4 py-2 rounded-lg font-semibold transition"
            onClick={onClose}
          >
            Cansel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfrimDelete;
