import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { professionalAvatars } from "@/lib/avatar-utils";
import { ChatHeader } from "@/components/group/ChatHeader";
import { ChatMessagesList } from "@/components/group/ChatMessagesList";
import { ChatInput } from "@/components/group/ChatInput";

const initialMessages = [
  {
    id: 1,
    senderId: 1,
    senderName: "Sarah Adams",
    senderAvatar: professionalAvatars.female[0].url,
    content: "Hi everyone, let's start the call soon 😊",
    timestamp: "10:30 AM",
    type: 'text'
  },
  {
    id: 2,
    senderId: 2,
    senderName: "Kate Johnson",
    senderAvatar: professionalAvatars.male[1].url,
    content: "Recently I saw properties in a great location that I did not pay attention to before 😊",
    timestamp: "10:24 AM",
    type: 'text'
  },
  {
    id: 3,
    senderId: 3,
    senderName: "Evan Scott",
    senderAvatar: professionalAvatars.male[0].url,
    content: "Ops, why don't you say something more",
    timestamp: "10:26 AM",
    type: 'text'
  },
  {
    id: 4,
    senderId: 1,
    senderName: "Sarah Adams",
    senderAvatar: professionalAvatars.female[0].url,
    content: "@Kate 😊",
    timestamp: "10:27 AM",
    type: 'text'
  },
  {
    id: 5,
    senderId: 0,
    senderName: "You",
    senderAvatar: "",
    content: "She creates an atmosphere of mystery 😊",
    timestamp: "11:26 AM",
    type: 'text'
  },
  {
    id: 6,
    senderId: 0,
    senderName: "You",
    senderAvatar: "",
    content: "😎 😊",
    timestamp: "11:26 AM",
    type: 'text'
  },
  {
    id: 7,
    senderId: 3,
    senderName: "Evan Scott",
    senderAvatar: professionalAvatars.male[0].url,
    content: "Kate, don't be like that and say something more :) 😊",
    timestamp: "11:34 AM",
    type: 'text'
  }
];

const members = [
  {
    id: 1,
    name: "Sarah Adams",
    avatar: professionalAvatars.female[0].url,
    isAdmin: true
  },
  {
    id: 2,
    name: "Kate Johnson",
    avatar: professionalAvatars.male[1].url,
    isAdmin: false
  },
  {
    id: 3,
    name: "Evan Scott",
    avatar: professionalAvatars.male[0].url,
    isAdmin: false
  },
  {
    id: 4,
    name: "Lisa Wong",
    avatar: professionalAvatars.female[1].url,
    isAdmin: true
  },
  {
    id: 5,
    name: "David Smith",
    avatar: professionalAvatars.male[2].url,
    isAdmin: false
  }
];

export function ChatPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const { groupId } = useParams();
  const currentUserId = 0;

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      senderId: currentUserId,
      senderName: "You",
      senderAvatar: "",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      type: 'text'
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleSendVoiceMessage = (audioBlob, duration) => {
    const message = {
      id: Date.now(),
      senderId: currentUserId,
      senderName: "You",
      senderAvatar: "",
      timestamp: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      type: 'voice',
      audioBlob,
      duration
    };

    setMessages([...messages, message]);
    setShowVoiceRecorder(false);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const message = {
        id: Date.now(),
        senderId: currentUserId,
        senderName: "You",
        senderAvatar: "",
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        timestamp: new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        type: 'file'
      };
      setMessages([...messages, message]);
    }
  };

  const getGroupName = (id) => {
    const groupNames = {
      '1': 'Web Development',
      '2': 'Data Science',
      '3': 'Mobile App Development',
      '4': 'UI/UX Design'
    };
    return groupNames[id] || `Group ${id}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="shadow-lg border-0 bg-white h-[700px] flex flex-col">
        <ChatHeader 
          groupName={getGroupName(groupId || '1')} 
          members={members} 
        />
        
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <ChatMessagesList 
            messages={messages} 
            currentUserId={currentUserId} 
          />

          <ChatInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            onSendMessage={handleSendMessage}
            onSendVoiceMessage={handleSendVoiceMessage}
            onFileSelect={handleFileSelect}
            showVoiceRecorder={showVoiceRecorder}
            setShowVoiceRecorder={setShowVoiceRecorder}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default ChatPage;