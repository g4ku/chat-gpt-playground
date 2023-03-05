import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import { useMutation } from "react-query";
import {
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import { GoSettings } from "react-icons/go";
import MainContainer from "@/templates/MainContainer";
import ChatView, { ChatItem } from "@/components/ChatView";
import * as styles from "../styles/Home";
import ChatText from "@/components/ChatText";
import ChatOption from "@/components/ChatOption";

function chat(data: {
  items: ChatItem[];
  systemRole: string;
  maxTokens: number;
}) {
  let messages = [];
  if (data.systemRole) {
    messages.push({ role: "system", content: data.systemRole });
  }
  messages = messages.concat(
    data.items
      .filter((x) => !x.error)
      .map((x) => ({ role: x.role, content: x.content }))
  );
  return fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      maxTokens: data.maxTokens,
    }),
  });
}

export default function Home() {
  const [items, setItems] = useState<ChatItem[]>([]);
  const [systemRole, setSystemRole] = useState("");
  const [maxTokens, setMaxTokens] = useState(0);
  const chatViewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollDownChat();
  }, [items]);

  const { mutate, isLoading } = useMutation(chat, {
    onSuccess: (res, variables) => {
      if (res.ok) {
        res
          .json()
          .then((json) =>
            addAssistantItem(
              variables.items,
              json.content.trim(),
              json.promptTokens,
              json.completionTokens
            )
          );
      } else {
        res
          .json()
          .then((json) => setErrorResponse(variables.items, json.error));
      }
    },
  });

  const scrollDownChat = () => {
    chatViewRef.current?.children[0].scrollIntoView(false);
  };

  const askChat = (text: string) => {
    const newItems: ChatItem[] = [...items, { role: "user", content: text }];
    mutate({ items: newItems, systemRole, maxTokens });
    setItems(newItems);
  };

  const addAssistantItem = (
    variables: ChatItem[],
    text: string,
    promptTokens: number,
    completionTokens: number
  ) => {
    // stateが古いためリクエスト時のvariablesから組み立てる
    const newItems: ChatItem[] = [
      ...variables,
      { role: "assistant", content: text, promptTokens, completionTokens },
    ];
    setItems(newItems);
  };

  const setErrorResponse = (variables: ChatItem[], error: string) => {
    variables[variables.length - 1].error = true;
    const newItems: ChatItem[] = [
      ...variables,
      { role: "assistant", content: error, error: true },
    ];
    setItems(newItems);
  };

  const clearItems = () => {
    setItems([]);
  };

  const handleUpdateSystemRole = (content: string) => {
    setSystemRole(content);
  };

  const handleUpdateMaxTokens = (token: number) => {
    setMaxTokens(token);
  };

  return (
    <>
      <Head>
        <title>ChatGPT Playground</title>
        <meta name="description" content="call ChatGPT(gpt-3.5-turbo) " />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <MainContainer
        rightContent={
          <Flex gap="3px">
            <Popover closeOnBlur={false}>
              <PopoverTrigger>
                <Button size="xs" colorScheme="teal">
                  <GoSettings />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Option</PopoverHeader>
                <PopoverBody>
                  <ChatOption
                    updateSystemRole={handleUpdateSystemRole}
                    updateMaxTokens={handleUpdateMaxTokens}
                  />
                </PopoverBody>
              </PopoverContent>
            </Popover>
            <Button size="xs" colorScheme="red" onClick={clearItems}>
              <FaTrash />
            </Button>
          </Flex>
        }
      >
        <div css={styles.container}>
          <div style={{ overflowY: "auto" }} ref={chatViewRef}>
            <ChatView items={items} fetching={isLoading} />
          </div>
          <ChatText onSubmit={askChat} fetching={isLoading} />
        </div>
      </MainContainer>
    </>
  );
}
