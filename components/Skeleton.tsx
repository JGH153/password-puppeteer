export const Skeleton = () => {
  return (
    <div role="status" className="max-w-sm animate-pulse">
      <div className="h-2 bg-gray-700 rounded-full max-w-[360px] mb-2.5"></div>
      <div className="h-2 bg-gray-700rounded-full mb-2.5"></div>

      <span className="sr-only">Loading...</span>
    </div>
  );
};
