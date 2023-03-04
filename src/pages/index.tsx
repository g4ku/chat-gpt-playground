import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import { useMutation } from "react-query";
import { Button } from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import MainContainer from "@/templates/MainContainer";
import ChatView, { ChatItem } from "@/components/ChatView";
import * as styles from "../styles/Home";
import ChatText from "@/components/ChatText";

function chat(items: ChatItem[]) {
  return fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify(
      items
        .filter((x) => !x.error)
        .map((x) => ({ role: x.role, content: x.content }))
    ),
  });
}

export default function Home() {
  const [items, setItems] = useState<ChatItem[]>([]);
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
            addAssistantItem(variables, json.content.trim(), json.tokens)
          );
      } else {
        res.json().then((json) => setErrorResponse(variables, json.error));
      }
    },
  });

  const scrollDownChat = () => {
    chatViewRef.current?.children[0].scrollIntoView(false);
  };

  const askChat = (text: string) => {
    const newItems: ChatItem[] = [...items, { role: "user", content: text }];
    mutate(newItems);
    setItems(newItems);
  };

  const addAssistantItem = (
    variables: ChatItem[],
    text: string,
    token: number
  ) => {
    // stateが古いためリクエスト時のvariablesから組み立てる
    const newItems: ChatItem[] = [
      ...variables,
      { role: "assistant", content: text, token },
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

  return (
    <>
      <Head>
        <title>ChatGPT Playground</title>
        <meta name="description" content="call ChatGPT(gpt-3.5-turbo) " />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <MainContainer
        rightContent={
          <Button size="xs" colorScheme="red" onClick={clearItems}>
            <FaTrash />
          </Button>
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
