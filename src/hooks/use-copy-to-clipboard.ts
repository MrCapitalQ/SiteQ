import { useCallback, useState } from 'react'
import { toast } from "sonner"

type CopyToClipboardFn = (text: string) => Promise<boolean>

export function useCopyToClipboard(): { copyToClipboard: CopyToClipboardFn, isCopied: boolean } {
  const [isCopied, setIsCopied] = useState<boolean>(false)

  const copyToClipboard: CopyToClipboardFn = useCallback(async text => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported')
      return false
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied to clipboard");
      setTimeout(() => {
        setIsCopied(false);
      }, 2500);
      setIsCopied(true);
      return true
    } catch (error) {
      console.warn('Copy failed', error)
      return false
    }
  }, [])

  return { copyToClipboard: copyToClipboard, isCopied }
}
