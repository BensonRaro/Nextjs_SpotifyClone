import { ImSpinner9 } from "react-icons/im";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <ImSpinner9 className="animate-spin size-12" />
    </div>
  );
};

export default Loader;
