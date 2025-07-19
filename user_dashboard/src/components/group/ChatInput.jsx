import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Paperclip } from "lucide-react";
import { VoiceRecorder } from "@/components/messages/VoiceRecorder";

export function ChatInput({
  newMessage,
  setNewMessage,
  onSendMessage,
  onSendVoiceMessage,
  onFileSelect,
  showVoiceRecorder,
  setShowVoiceRecorder
}) {
  const fileInputRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  if (showVoiceRecorder) {
    return (
      <div className="border-t bg-gray-50 p-4 flex-shrink-0">
        <VoiceRecorder 
          onSendVoiceMessage={onSendVoiceMessage}
          onCancel={() => setShowVoiceRecorder(false)}
        />
      </div>
    );
  }

  return (
    <div className="border-t bg-gray-50 p-4 flex-shrink-0">
      <div className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleAttachmentClick}
            className="absolute left-3 bottom-3 h-7 w-7 text-gray-400 hover:text-gray-600 z-10"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Write your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-12 pr-4 min-h-[48px] text-sm resize-none rounded-2xl border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileSelect}
          className="hidden"
          accept="image/*,video/*,.pdf,.doc,.docx,.txt"
        />
        <VoiceRecorder 
          onSendVoiceMessage={onSendVoiceMessage}
          onCancel={() => setShowVoiceRecorder(false)}
        />
        <Button 
          onClick={onSendMessage}
          disabled={!newMessage.trim()}
          size="icon"
          className="h-[48px] w-[48px] rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

export default ChatInput;