import { Button } from "@/components/Button";

interface Props {
  passwordInput: string;
  setPasswordInput: (passwordInput: string) => void;
  onSubmitPassword: () => void;
}

export const PasswordInput = (props: Props) => {
  return (
    <div className="flex flex-row justify-center">
      <input
        type="text"
        id="first_name"
        value={props.passwordInput}
        onChange={(e) => props.setPasswordInput(e.target.value)}
        className=" border  rounded-lg block w-full p-2.5 mr-4 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
        placeholder="Secret password"
        required
      />
      <Button onClick={props.onSubmitPassword} greenButton={true}>
        Submit
      </Button>
    </div>
  );
};
