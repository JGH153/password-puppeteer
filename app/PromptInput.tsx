import { Button } from "@/components/Button";

interface Props {
  promptInput: string;
  setPromptInput: (promptInput: string) => void;
  onSubmitPrompt: () => void;
  className?: string;
}

export const PromptInput = (props: Props) => {
  return (
    <div className={props.className}>
      <label
        htmlFor="message"
        className="block mb-2 font-medium text-gray-900 dark:text-white"
      >
        Your prompt:
      </label>
      <div className="rounded-lg border border-gray-300   focus-within:ring-blue-500 focus-within:border-blue-500">
        <textarea
          id="message"
          rows={4}
          className="block p-2.5 w-full resize-none rounded-t-lg bg-gray-700 dark:border-gray-600 placeholder-gray-400 text-white focus:outline-none"
          placeholder="Write your thoughts here..."
        ></textarea>
        <div className="flex flex-row justify-end p-2 bg-gray-700 rounded-b-lg">
          <Button onClick={props.onSubmitPrompt}>Submit</Button>
        </div>
      </div>
    </div>
  );
};
