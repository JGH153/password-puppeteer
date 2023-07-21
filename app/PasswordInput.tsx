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
        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mr-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Secret password"
        required
      />
      <Button onClick={props.onSubmitPassword}>Submit</Button>
    </div>
  );
};
