interface Props {
  children: React.ReactNode;
  greenButton?: boolean;
  onClick: () => void;
}

export const Button = (props: Props) => {
  if (props.greenButton)
    return (
      <button
        type="button"
        onClick={props.onClick}
        className="text-base text-white focus:ring-4  font-medium rounded-lg px-5 py-2.5 bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-green-800"
      >
        {props.children}
      </button>
    );

  return (
    <button
      type="button"
      onClick={props.onClick}
      className="text-base text-white focus:ring-4  font-medium rounded-lg px-5 py-2.5 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800"
    >
      {props.children}
    </button>
  );
};
