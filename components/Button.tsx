interface Props {
  children: React.ReactNode;
  onClick: () => void;
}

export const Button = (props: Props) => {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className="text-base text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    >
      {props.children}
    </button>
  );
};
