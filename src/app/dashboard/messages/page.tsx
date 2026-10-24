"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Send, User, Lock, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ConversationItem, MessageItem } from "@/types";

export default function MessagesPage() {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>("conv-1");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    async function loadConversations() {
      if (!currentUser) return;
      try {
        const res = await fetch(`/api/messages?userId=${currentUser.id}`);
        if (res.ok) {
          const data = await res.json();
          setConversations(data.conversations || []);
          if (data.conversations?.length > 0 && !selectedConvId) {
            setSelectedConvId(data.conversations[0].id);
          }
        }
      } catch (e) {
        console.error("Error loading conversations", e);
      }
    }
    loadConversations();
  }, [currentUser]);

  useEffect(() => {
    async function loadMessages() {
      if (!selectedConvId) return;
      try {
        const res = await fetch(`/api/messages?conversationId=${selectedConvId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
      } catch (e) {
        console.error("Error loading messages", e);
      }
    }
    loadMessages();
  }, [selectedConvId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !selectedConvId) return;
    setIsSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConvId,
          senderId: currentUser.id,
          content: newMessage.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");
      }
    } catch (e) {
      console.error("Error sending message", e);
    } finally {
      setIsSending(false);
    }
  };

  const selectedConv = conversations.find((c) => c.id === selectedConvId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950 font-serif">Stay Conversations & Messages</h1>
        <p className="text-xs text-slate-500">
          Private, booking-linked communication between verified hosts and traveling members.
        </p>
      </div>

      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-subtle overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[550px]">
        {/* Left Conversations Sidebar */}
        <div className="md:col-span-4 border-r border-slate-200/80 p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Active Chats
          </div>
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">No active conversations</div>
          ) : (
            conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedConvId(c.id)}
                className={`w-full text-left p-3 rounded-2xl transition-all flex items-start gap-3 ${
                  c.id === selectedConvId
                    ? "bg-teal-50 border border-teal-200/70"
                    : "hover:bg-slate-50"
                }`}
              >
                <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold flex-shrink-0">
                  {c.other_user?.full_name?.charAt(0) || "U"}
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-navy-950 truncate">
                      {c.other_user?.full_name}
                    </span>
                  </div>
                  <div className="text-[11px] text-teal-700 font-semibold truncate">
                    {c.property?.title}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {c.last_message}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Right Chat Pane */}
        <div className="md:col-span-8 flex flex-col justify-between bg-slate-50/30">
          {/* Header */}
          <div className="p-4 border-b border-slate-200/80 bg-white flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-navy-950">
                {selectedConv?.other_user?.full_name || "Member"}
              </div>
              <div className="text-[11px] text-slate-500">
                {selectedConv?.property?.title} ({selectedConv?.property?.city})
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-teal-700 font-semibold bg-teal-50 px-2.5 py-1 rounded-full">
              <Lock className="h-3 w-3" />
              <span>Encrypted Stay Thread</span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {messages.map((m) => {
              const isMine = m.sender_id === currentUser?.id;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                      isMine
                        ? "bg-navy-950 text-white rounded-br-none"
                        : "bg-white border border-slate-200 text-slate-900 rounded-bl-none shadow-subtle"
                    }`}
                  >
                    {m.content}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 px-1">
                    {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200/80 bg-white flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your message to the host..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <Button type="submit" variant="teal" size="sm" isLoading={isSending}>
              <Send className="h-3.5 w-3.5 mr-1" />
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
