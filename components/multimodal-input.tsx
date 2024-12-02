export function MultimodalInput({
  inputValue,
  setInputValue,
  onSend,
  isLoading,
}: {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-3 w-[90%] md:w-[70%] lg:w-[60%]">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Ask me about grocery products, stores, recipes 🥳🫂..."
        className="flex-auto p-5 text-lg border-2 border-transparent rounded-full focus:outline-none focus:border-white-500 bg-[hsl(155,85%,15%)] text-white placeholder-gray-300"
        disabled={isLoading}
      />
      <button
        onClick={onSend}
        disabled={isLoading}
        className={`p-4 px-6 text-lg rounded-full text-white transition-colors duration-200 ${
          isLoading ? 'bg-blue-600 opacity-50 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600'
        }`}
      >
        enter
      </button>
    </div>
  );
}
