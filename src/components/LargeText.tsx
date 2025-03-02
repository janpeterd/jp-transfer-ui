// components/LargeText.tsx
interface LargeTextProps {
  string?: string; // Optional prop with a default value
}

const LargeText: React.FC<LargeTextProps> = ({ string = "JP Transfer" }) => {
  return (
    <>
      <div
        id="largetext"
        className="z-10 text-white translate-y-2 select-none overflow-hidden text-center font-custom text-7xl font-bold uppercase opacity-10 md:text-9xl"
      >
        {string}
      </div>
    </>
  );
};

export default LargeText;
