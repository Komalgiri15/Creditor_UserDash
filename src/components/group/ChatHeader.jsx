import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { ParticipantsPanel } from "./ParticipantsPanel";

export function ChatHeader({ groupName, members }) {
  return (
    <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-gray-50 rounded-t-lg flex-shrink-0">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold text-gray-800 mb-1">
            {groupName}
          </CardTitle>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              {members.length} participants
            </p>
            <ParticipantsPanel participantCount={members.length} />
          </div>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
          Active
        </Badge>
      </div>
    </CardHeader>
  );
}

export default ChatHeader;