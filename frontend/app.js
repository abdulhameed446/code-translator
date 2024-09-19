const { useState, useEffect, useRef } = React;
const axios = window.axios;

const App = () => {
    const [sourceText, setSourceText] = useState("");
    const [targetText, setTargetText] = useState("");
    const [copySuccess, setCopySuccess] = useState("");
    const [darkMode, setDarkMode] = useState(true);
    const [showTargetDropdown, setShowTargetDropdown] = useState(false);
    const [targetLanguages, setTargetLanguages] = useState(["JavaScript", "Python", "Java"]);
    const [selectedSourceLanguage] = useState("JavaScript"); // Default, no need to change
    const [selectedTargetLanguage, setSelectedTargetLanguage] = useState("JavaScript");
    const [targetSearch, setTargetSearch] = useState(""); // State for target search input
    const [isTranslating, setIsTranslating] = useState(false); // To manage translation status

    const targetDropdownRef = useRef(null);

    const allLanguages = ["ABAP", "Ada", "Agda", "Alloy", "ANTLR", "AppleScript", "Arduino", "ASP", "Assembly", "Augeas", "Awk", "Batchfile", "Bison", "Bluespec", "C", "C-sharp", "C++", "Clojure", "CMake", "COBOL", "CoffeeScript", "Common_Lisp", "CSS", "Cucumber", "Cuda", "Cython", "Dart", "Dockerfile", "Eagle", "Elixir", "Elm", "Emacs_Lisp", "Erlang", "F-sharp", "FORTRAN", "GLSL", "GO", "Gradle", "GraphQL", "Groovy", "Haskell", "Haxe", "HCL", "HTML", "Idris", "Isabelle", "Java", "Java_Server_Pages", "JavaScript", "JSON", "JSON5", "JSONiq", "JSONLD", "JSX", "Julia", "Jupyter", "Kotlin", "Lean", "Literate_Agda", "Literate_CoffeeScript", "Literate_Haskell", "Lua", "Makefile", "Maple", "Markdown", "Mathematica", "Objective-C++", "OCaml", "OpenCL", "Pascal", "Perl", "PHP", "PowerShell", "Prolog", "Protocol_Buffer", "Python", "Python_traceback", "R", "Racket", "RDoc", "Restructuredtext", "RHTML", "RMarkdown", "Ruby", "Rust", "SAS", "Scala", "Scheme", "Shell", "Smalltalk", "Solidity", "SPARQL", "SQL", "Stan", "Standard_ML", "Stata", "Swift", "SystemVerilog", "Tcl", "Tcsh", "Tex", "Thrift", "Twig", "TypeScript", "Verilog", "VHDL", "Visual_Basic", "Vue", "Web_Ontology_Language", "WebAssembly", "XML", "XSLT", "Yacc", "YAML", "Zig"];

    const handleSourceTextChange = (event) => {
        const newText = event.target.value;
        setSourceText(newText);
        // Clear target text when source text is cleared
        if (newText.trim() === "") {
            setTargetText("");
        }
    };

    const toggleDropdown = (type) => {
        if (type === 'target') {
            setShowTargetDropdown((prev) => !prev);
        }
    };

    const handleClickOutside = (event) => {
        if (targetDropdownRef.current && !targetDropdownRef.current.contains(event.target)) {
            setShowTargetDropdown(false);
        }
    };

    const selectLanguage = (lang) => {
        if (targetLanguages.includes(lang)) {
            setSelectedTargetLanguage(lang);
        } else {
            setTargetLanguages((prev) => [lang, ...prev.slice(0, 2)]);
            setSelectedTargetLanguage(lang);
        }
        setShowTargetDropdown(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(targetText).then(() => {
            setCopySuccess("Copied!");
            setTimeout(() => setCopySuccess(""), 2000);
        });
    };

    const handleTranslate = async () => {
        setIsTranslating(true);
        try {
            const response = await axios.post('http://localhost:5000/api/translate', {
                sourceLanguage: selectedSourceLanguage,
                targetLanguage: selectedTargetLanguage,
                sourceCode: sourceText,
            });
            setTargetText(response.data.targetCode || '');
        } catch (error) {
            console.error('Error translating text:', error.message || error);
            setTargetText("Error translating text.");
        } finally {
            setIsTranslating(false);
        }
    };

    const toggleDarkMode = () => setDarkMode((prev) => !prev);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const countCharacters = (text) => text.length;
    const countLines = (text) => text.split('\n').length;

    const filteredTargetLanguages = allLanguages.filter((lang) =>
        lang.toLowerCase().includes(targetSearch.toLowerCase())
    );

    return (
        <div className={`main ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <header className="header w-full p-4 flex items-center justify-between">
                <div className="flex items-center">
                    <i className="fas fa-code text-2xl mr-2" aria-hidden="true"></i>
                    <h1 className="text-2xl font-bold">Code Translator</h1>
                </div>
                <button className="button px-4 py-2 rounded" onClick={toggleDarkMode}>
                    {darkMode ? (
                        <i className="fas fa-sun" aria-hidden="true"></i>
                    ) : (
                        <i className="fas fa-moon" aria-hidden="true"></i>
                    )}
                </button>
            </header>
            <div className="flex flex-col md:flex-row w-full md:w-3/4 border rounded-lg overflow-hidden mb-4">
                <div className="w-full md:w-1/2 p-4 border-r relative">
                    {/* Empty div to maintain space where the source language bar used to be */}
                    <div className="mb-4 invisible">
                        {selectedSourceLanguage}
                    </div>
                    <textarea
                        className="textarea w-full p-2 border"
                        placeholder="Enter your code here..."
                        value={sourceText}
                        onChange={handleSourceTextChange}
                    ></textarea>
                    <div className="text-xs text-gray-500 mt-2">
                        {countCharacters(sourceText)} characters, {countLines(sourceText)} lines
                    </div>
                </div>
                <div className="w-full md:w-1/2 p-4 relative" ref={targetDropdownRef}>
                    <div className="flex items-center mb-2">
                        {targetLanguages.map((lang, index) => (
                            <button
                                key={index}
                                className={`px-2 ${selectedTargetLanguage === lang ? 'selected' : 'text-gray-400'}`}
                                onClick={() => selectLanguage(lang)}
                            >
                                {lang}
                            </button>
                        ))}
                        <i
                            className="fas fa-chevron-down text-gray-400 ml-2 cursor-pointer"
                            onClick={() => toggleDropdown('target')}
                        />
                    </div>

                    {showTargetDropdown && (
                        <div className="absolute dropdown border rounded shadow-lg mt-2 w-full z-10 max-h-60 overflow-y-auto">
                            <input
                                type="text"
                                className="w-full px-4 py-2 border-b"
                                placeholder="Search languages..."
                                value={targetSearch}
                                onChange={(e) => setTargetSearch(e.target.value)}
                            />
                            {filteredTargetLanguages.map((lang, index) => (
                                <div
                                    key={index}
                                    className="px-4 py-2 dropdown-item cursor-pointer"
                                    onClick={() => selectLanguage(lang)}
                                >
                                    {lang}
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="relative">
                        <textarea
                            className="output w-full p-2 border"
                            value={targetText}
                            readOnly
                        ></textarea>
                        <button
                            className="button absolute bottom-2 right-2 p-2 rounded"
                            onClick={handleCopy}
                        >
                            <i className="fas fa-copy"></i>
                        </button>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                        {countCharacters(targetText)} characters, {countLines(targetText)} lines
                    </div>
                </div>
            </div>
            <div className="flex justify-center mb-4">
                <button
                    className="button px-4 py-2 rounded"
                    onClick={handleTranslate}
                    disabled={isTranslating}
                >
                    {isTranslating ? 'Translating...' : 'Translate'}
                </button>
            </div>
            <footer className="footer text-xs text-gray-500 mt-auto py-4">
                &copy; 202 CyberNetwork. All rights reserved.
            </footer>
        </div>
    );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
