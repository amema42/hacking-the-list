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
    <div className="flex items-center p-4" style={{ backgroundColor: 'hsl(155, 85%, 10%)' }}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Scrivi un messaggio..."
        className="flex-auto p-3 border-2 border-transparent rounded-3xl focus:outline-none focus:border-white-500 bg-[hsl(155,85%,15%)] text-white placeholder-gray-300"
        disabled={isLoading}
      />
      <button
        onClick={onSend}
        disabled={isLoading}
        className={`p-3 ml-3 rounded-full text-white transition-colors duration-200 ${
          isLoading ? 'bg-blue-600 opacity-50 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600'
        }`}
      >
        Enter
      </button>
    </div>
  );
}

