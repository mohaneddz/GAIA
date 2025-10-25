import { useState, useEffect } from "react"
import { readText } from '@tauri-apps/plugin-clipboard-manager';


export default function Clipboard() {

    const [content, setContent] = useState<string>("");

    useEffect(() => {
        const interval = setInterval(() => {
            getClipboardText();
        }
            , 1000);

        return () => clearInterval(interval);
    }, []);

    const getClipboardText = async () => {
        const clipboardText = await readText();
        setContent(clipboardText || "Clipboard is empty");
    };

    getClipboardText();

    return (
        <div className="border-2 text-center border-dashed border-gray-400 p-4 text-slate-400">
            <p>{content ? content : 'Clipboard is empty'}</p>
        </div>
    )
}
